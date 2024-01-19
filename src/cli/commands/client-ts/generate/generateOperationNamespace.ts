import { source } from "common-tags"
import { generateSchemas } from "@/cli/commands/client-ts/generate/generateTypes"
import { getNamespaceName } from "@/codegen/typescript/getNamespaceName"
import { OperationData } from "@/gql/OperationData"

export function generateOperationNamespace(operation: OperationData) {
	const { name, query, variableSamples, dataSamples } = operation

	const variableSchemas = generateSchemas(variableSamples, "Variables")
	const dataSchemas = generateSchemas(dataSamples, "Data")

	const namespaceName = getNamespaceName(name)

	const result = source`
		export namespace ${namespaceName} {
			export const request = createGqlQueryRequest(
				"${query.replaceAll("\n", "\\n")}"
			)

			export namespace Variables {
				${variableSchemas}

				export const schema = VariablesSchema
			}

			export type Variables = Variables.Variables

			export namespace Data {
				${dataSchemas}

				export const schema = DataSchema
			}

			export type Data = Data.Data
		}
	`

	return result
}
