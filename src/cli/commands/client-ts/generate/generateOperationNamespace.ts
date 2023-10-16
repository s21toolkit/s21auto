import { source } from "common-tags"
import { generateTypes } from "@/cli/commands/client-ts/generate/generateTypes"
import { getNamespaceName } from "@/codegen/typescript/getNamespaceName"
import { OperationData } from "@/gql/OperationData"

export function generateOperationNamespace(operation: OperationData) {
	const { name, query, variableSamples, dataSamples } = operation

	const variableTypes = generateTypes(variableSamples, "Variables")
	const dataTypes = generateTypes(dataSamples, "Data")

	const namespaceName = getNamespaceName(name)

	const result = source`
		export namespace ${namespaceName} {
			export const request = createGqlQueryRequest(
				"${query.replaceAll(/\s+/g, " ")}"
			)

			export namespace Variables {
				${variableTypes}
			}

			export type Variables = Variables.Variables

			export namespace Data {
				${dataTypes}
			}

			export type Data = Data.Data
		}
	`

	return result
}
