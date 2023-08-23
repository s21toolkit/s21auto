import { source } from "common-tags"
import {
	GoTargetLanguage,
	InputData,
	jsonInputForTargetLanguage,
	quicktype,
} from "quicktype-core"

export async function generate(
	operationName: string,
	query: string,
	variablesJsonSamples: string[],
	dataJsonSamples: string[],
) {
	const variablesTypes = await generateTypes(variablesJsonSamples, "Variables")
	const dataTypes = await generateTypes(dataJsonSamples, "Data")

	const operation = capitalizeFirstLetter(operationName)

	let typeSources = source`
		package requests

		import "s21client/gql"

		${variablesTypes}

		${dataTypes}

	`

	const types = getTypeNames(typeSources)

	for (const type of types) {
		typeSources = typeSources.replaceAll(
			new RegExp(String.raw`\b${type}\b`, "g"),
			`${type}_${operation}`,
		)
	}

	const result = source`
		${typeSources}

		func (ctx *RequestContext) ${operation}(variables Variables_${operation}) (Data_${operation}, error) {
			request := gql.NewQueryRequest[Variables_${operation}](
				"${query}",
				variables,
			)

			return GqlRequest[Data_${operation}](ctx, request)
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
	})

	return render.lines.join("\n")
}

const TYPEDEF_PATTERN = /(?<=type\s+)([\w\d_]+)/g

function getTypeNames(source: string) {
	const types = source.matchAll(TYPEDEF_PATTERN)

	return Array.from(types).map((match) => match[0])
}
