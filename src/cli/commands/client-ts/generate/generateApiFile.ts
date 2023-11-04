import { source } from "common-tags"

export function generateApiFile(apiNamespace: string, apiContext: string) {
	const result = source`
		import { Client } from "@/Client"
		import { createGqlQueryRequest } from "@/gql"

		type ElideVariables<TVariables> = {} extends TVariables
			? [variables?: TVariables]
			: [variables: TVariables]

		function useDefaultVariables<T>(variables: T | undefined): Partial<T> {
			return variables ?? {}
		}

		${apiNamespace}

		${apiContext}
	`

	return result
}
