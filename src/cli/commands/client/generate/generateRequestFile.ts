import { source } from "common-tags"
import { flow } from "effect/Function"
import { generateTypes } from "@/cli/commands/client/generate/generateTypes"
import { mapTypes } from "@/cli/commands/client/generate/mapTypes"
import { GOLANG_CODEGEN_WARNING } from "@/codegen/golang/codegenWarning"
import { getMethodName } from "@/codegen/golang/getMethodName"
import { getMethodTypeNameMapper } from "@/codegen/golang/getMethodTypeNameMapper"
import { getRequestTypeName } from "@/codegen/golang/getRequestTypeName"
import { getResponseTypeName } from "@/codegen/golang/getResponseTypeName"
import { OperationData } from "@/gql/OperationData"

export function generateRequestFile(operation: OperationData) {
	const { name, query, variableSamples, dataSamples } = operation

	const variableTypes = generateTypes(variableSamples, "Variables")
	const dataTypes = generateTypes(dataSamples, "Data")

	const method = getMethodName(name)

	const getMethodTypeName = getMethodTypeNameMapper(method)

	const requestTypeMapper = flow(getRequestTypeName, getMethodTypeName)

	const responseTypeMapper = flow(getResponseTypeName, getMethodTypeName)

	const variableType = getMethodTypeName("Variables")
	const dataType = getMethodTypeName("Data")

	const result = source`
		${GOLANG_CODEGEN_WARNING}
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
