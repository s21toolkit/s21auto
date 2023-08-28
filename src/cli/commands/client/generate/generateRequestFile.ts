import { source } from "common-tags"
import { generateTypes } from "@/cli/commands/client/generate/generateTypes"
import { mapTypes } from "@/cli/commands/client/generate/mapTypes"
import { pipe } from "@/utils/pipe"

export type RequestFileConfig = {
	operation: string
	query: string
	variableSamples: string[]
	dataSamples: string[]
}

export async function generateRequestFile(config: RequestFileConfig) {
	const { operation, query, variableSamples, dataSamples } = config

	const variableTypes = await generateTypes(variableSamples, "Variables")
	const dataTypes = await generateTypes(dataSamples, "Data")

	const method = getMethodName(operation)

	const operationTypeMapper = pipe.from<string>().then(getMethodType(method))

	const requestTypeMapper = operationTypeMapper.then(getRequestType).done()
	const responseTypeMapper = operationTypeMapper.then(getResponseType).done()

	const variableType = operationTypeMapper.call("Variables")
	const dataType = operationTypeMapper.call("Data")

	const result = source`
		package requests

		import "github.com/s21toolkit/s21client/gql"

		${mapTypes(variableTypes, requestTypeMapper)}

		${mapTypes(dataTypes, responseTypeMapper)}

		func (ctx *RequestContext) ${method}(variables ${variableType}) (${dataType}, error) {
			request := gql.NewQueryRequest[${variableType}](
				"${query.replaceAll("\n", "\\n")}",
				variables,
			)

			return GqlRequest[${dataType}](ctx, request)
		}
	`

	return result
}

function getMethodName(string: string) {
	return `${string[0].toUpperCase()}${string.slice(1)}`
}

function getRequestType(type: string) {
	if (type.startsWith("Variables_")) {
		return type
	}

	return `Variables_${type}`
}

function getResponseType(type: string) {
	if (type.startsWith("Data_")) {
		return type
	}

	return `Data_${type}`
}

function getMethodType(method: string) {
	return function (type: string) {
		return `${type}_${method}`
	}
}
