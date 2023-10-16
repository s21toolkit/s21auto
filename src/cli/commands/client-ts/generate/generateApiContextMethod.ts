import { source } from "common-tags"
import { getNamespaceName } from "@/codegen/typescript/getNamespaceName"

export function generateApiContextMethod(operationName: string) {
	const namespaceName = getNamespaceName(operationName)

	const result = source`
		async ${operationName}(
			...[variables]: ElideVariables<Api.${namespaceName}.Variables>
		) {
			return this.client.request<Api.${namespaceName}.Data>({
				...Api.${namespaceName}.request,
				variables: useDefaultVariables(variables)
			})
		}
	`

	return result
}
