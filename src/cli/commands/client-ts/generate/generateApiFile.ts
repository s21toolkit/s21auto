import { source } from "common-tags"
import { TYPESCRIPT_CODEGEN_WARNING } from "@/codegen/typescript/codegenWarning"

export function generateApiFile(apiNamespace: string, apiContext: string) {
	const result = source`
		${TYPESCRIPT_CODEGEN_WARNING}
		import { z } from "zod"
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
