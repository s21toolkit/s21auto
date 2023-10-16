import { source } from "common-tags"

export function generateApiNamespace(requestNamespaces: string[]) {
	const result = source`
		export namespace Api {
			${requestNamespaces.join("\n\n")}
		}
	`

	return result
}
