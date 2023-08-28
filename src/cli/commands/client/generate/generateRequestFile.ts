import { source } from "common-tags"
import { generateTypes } from "@/cli/commands/client/generate/generateTypes"
import { mapTypes } from "@/cli/commands/client/generate/mapTypes"
import { getMethodName } from "@/codegen/getMethodName"
import { getMethodTypeName } from "@/codegen/getMethodTypeName"
import { getRequestTypeName } from "@/codegen/getRequestTypeName"
import { getResponseTypeName } from "@/codegen/getResponseTypeName"
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

	// prettier-ignore
	const operationTypeMapper = pipe
		.from<string>()
		.then(getMethodTypeName(method))

	// prettier-ignore
	const requestTypeMapper = operationTypeMapper
		.then(getRequestTypeName)
		.done()

	// prettier-ignore
	const responseTypeMapper = operationTypeMapper
		.then(getResponseTypeName)
		.done()

	const variableType = getMethodTypeName("Variables")
	const dataType = getMethodTypeName("Data")

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
