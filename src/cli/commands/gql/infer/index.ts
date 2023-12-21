import { command, option } from "cmd-ts"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { generateSchema } from "@/cli/commands/docs/generate/generateSchema"
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

function eliminateReferences(typeName: string, data: unknown) {
	if (typeof data != "object" || data == null) {
		return
	}

	for (const [key, value] of Object.entries(data)) {
		if (typeof value != "object" || value == null) {
			continue
		}

		if ("__typename" in value && value.__typename !== typeName) {
			data[key as never] = {
				__ref: true,
				[`${value.__typename}`]: null,
			} as never
		} else {
			eliminateReferences(typeName, data[key as never])
		}
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
				eliminateReferences(typeName, sample)
			}

			const schema = generateSchema(
				samples.map((data) => JSON.stringify(data)),
				typeName,
			)

			typeSchemas.set(typeName, JSON.parse(schema))
		}

		console.log(JSON.stringify(Array.from(typeSchemas.entries()), null, 2))

		// console.error(Array.from(typeSampleMap.keys()))
	},
})
