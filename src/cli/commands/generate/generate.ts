import { source } from "common-tags"
import {
	GoTargetLanguage,
	InputData,
	jsonInputForTargetLanguage,
	quicktype,
} from "quicktype-core"

type Wrapper = (types: string) => string

export async function generate(
	operationName: string,
	query: string,
	variablesJsonSamples: string[],
	dataJsonSamples: string[],
) {
	const variablesTypes = await generateTypes(variablesJsonSamples, "Variables")
	const dataTypes = await generateTypes(dataJsonSamples, "Data")

	const operation = capitalizeFirstLetter(operationName)

	const commonWrappers = [wrapOperationType(operation)]
	const requestWrappers = [...commonWrappers, wrapRequestType]
	const responseWrappers = [...commonWrappers, wrapResponseType]

	let typeSources = source`
		package requests

		import "s21client/gql"

		${renameTypes(variablesTypes, requestWrappers)}

		${renameTypes(dataTypes, responseWrappers)}

	`

	const variablesType = applyWrappers("Variables", requestWrappers)
	const dataType = applyWrappers("Data", responseWrappers)

	const result = source`
		${typeSources}

		func (ctx *RequestContext) ${operation}(variables ${variablesType}) (${dataType}, error) {
			request := gql.NewQueryRequest[${variablesType}](
				"${query}",
				variables,
			)

			return GqlRequest[${dataType}](ctx, request)
		}
	`

	return result
}

function capitalizeFirstLetter(string: string) {
	return `${string[0].toUpperCase()}${string.slice(1)}`
}

async function generateTypes(jsonSamples: string[], name: string) {
	const inputData = new InputData()

	const lang = new GoTargetLanguage()

	await inputData.addSource("json", { name, samples: jsonSamples }, () =>
		jsonInputForTargetLanguage(lang),
	)

	const render = await quicktype({
		lang,
		inputData,
		rendererOptions: {
			"just-types": true,
		},
		inferEnums: false
	})

	return render.lines.join("\n")
}

const TYPEDEF_PATTERN = /(?<=type\s+)([\w\d_]+)/g

function getTypeNames(source: string) {
	const types = source.matchAll(TYPEDEF_PATTERN)

	return Array.from(types).map((match) => match[0])
}

function wrapRequestType(type: string) {
	return `Request_${type}`
}

function wrapResponseType(type: string) {
	return `Response_${type}`
}

function wrapOperationType(operation: string) {
	return function (type: string) {
		return `${type}_${operation}`
	}
}

function applyWrappers(type: string, wrappers: Wrapper[]) {
	return wrappers.reduce((p, w) => w(p), type)
}

function renameTypes(source: string, wrappers: Wrapper[]) {
	const types = getTypeNames(source)
	let sources = source

	for (const type of types) {
		sources = sources.replaceAll(
			new RegExp(String.raw`\b${type}\b`, "g"),
			applyWrappers(type, wrappers),
		)
	}

	return sources
}
