import { $RefParser } from "@apidevtools/json-schema-ref-parser"
import { command, option } from "cmd-ts"
import { source } from "common-tags"
import { JSONSchemaTargetLanguage } from "quicktype-core"
import { getGraphQLWriter, getJsonSchemaReader, makeConverter } from "typeconv"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { quicktypeJsonSamples } from "@/codegen/quicktypeJsonSamples"
import { GqlRequest } from "@/gql/GqlRequest"
import { getApiOperations } from "@/har/getApiOperations"
import { merge } from "@/har/merge"

function getTypeSamples(typeSamples: Map<string, object[]>, data: unknown) {
	if (typeof data != "object" || data == null) {
		return
	}

	if ("__typename" in data) {
		const typeName = data.__typename as string

		if (!typeSamples.has(typeName)) {
			typeSamples.set(typeName, [])
		}

		typeSamples.get(typeName)!.push(structuredClone(data))
	}

	for (const value of Object.values(data)) {
		getTypeSamples(typeSamples, value)
	}
}

function eliminateTypeReferences(typeName: string, data: unknown) {
	if (typeof data != "object" || data == null) {
		return
	}

	for (const [key, value] of Object.entries(data)) {
		if (typeof value != "object" || value == null) {
			continue
		}

		if ("__typename" in value && value.__typename !== typeName) {
			data[key as never] = { $typeref: null, [value.__typename]: null } as never
		} else {
			eliminateTypeReferences(typeName, data[key as never])
		}
	}
}

function dereference(schema: any) {
	const { definitions } = schema

	function dereferenceObject(object: any, resolved: string[] = []) {
		if (typeof object != "object" || object == null) {
			return
		}
		const _resolved = structuredClone(resolved)

		if ("$ref" in object) {
			const definitionName = (object.$ref as string).replace(
				"#/definitions/",
				"",
			)

			if (resolved.includes(definitionName)) {
				return
			}

			const definition =
				definitionName === "#"
					? Object.values(definitions)[0]
					: definitions[definitionName]

			Object.assign(object, definition)

			delete object.$ref

			_resolved.push(definitionName)
		}

		for (const value of Object.values(object)) {
			dereferenceObject(value, _resolved)
		}
	}

	dereferenceObject(schema)

	delete schema.definitions
}

function resolveTyperefs(schema: any) {
	if (typeof schema != "object" || schema == null) {
		return
	}

	if (schema.properties?.$typeref) {
		const definitionName = Object.keys(schema.properties).find(
			(k) => k !== "$typeref",
		)!

		for (const key in schema) {
			delete schema[key]
		}

		schema.$ref = `#/definitions/${definitionName}`
	}

	for (const value of Object.values(schema)) {
		resolveTyperefs(value)
	}
}

export const inferCommand = command({
	name: "infer",
	description: "Infers GraphQL schema from HAR file",
	args: {
		...harFiles,
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output schema (.graphql) file",
			defaultValue: () => "schema.graphql",
			type: NewFile,
		}),
	},
	async handler(argv) {
		const har = merge(argv.harFirst, ...argv.harRest)

		const operations = getApiOperations(har)

		const typeSamples = new Map<string, object[]>()

		for (const [, entries] of operations.entries()) {
			for (const entry of entries) {
				if (
					!entry.request.url.includes("graphql") ||
					entry.response.status !== 200
				) {
					continue
				}

				const rawText = entry.response.content.text!
				const text =
					entry.response.content.encoding === "base64" ? atob(rawText) : rawText

				const responseData = JSON.parse(text)

				getTypeSamples(typeSamples, responseData)
			}
		}

		const typeSchemas = new Map<string, unknown>()

		for (const [typeName, samples] of typeSamples.entries()) {
			for (const sample of samples) {
				eliminateTypeReferences(typeName, sample)
			}

			const schemaText = quicktypeJsonSamples(
				new JSONSchemaTargetLanguage(),
				{
					rendererOptions: {
						"just-types": true,
					},
					inferEnums: false,
				},
				samples.map((data) => JSON.stringify(data)),
				typeName,
			)

			const schema = JSON.parse(schemaText)

			dereference(schema)
			resolveTyperefs(schema)

			typeSchemas.set(typeName, schema)
		}

		const mainSchema: any = {
			$schema: "http://json-schema.org/draft-06/schema#",
			definitions: {},
		}

		for (const [typeName, schema] of typeSchemas) {
			mainSchema.definitions[typeName] = schema
		}

		const reader = getJsonSchemaReader()
		const writer = getGraphQLWriter()

		const converter = makeConverter(reader, writer)

		const converted = await converter.convert({
			data: JSON.stringify(mainSchema),
		})

		let graphqlSchema = converted.data

		for (const [, [entry]] of operations) {
			const requestData = JSON.parse(
				entry.request.postData!.text!,
			) as GqlRequest

			graphqlSchema = source`
				${graphqlSchema}

				${requestData.query}
			`
		}

		// console.log(JSON.stringify(mainSchema, null, 2))

		// console.error(Array.from(typeSamples.keys()))

		console.log(graphqlSchema)
	},
})
