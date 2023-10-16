import { source } from "common-tags"

export function generateApiContext(methods: string[]) {
	const result = source`
		export class ApiContext {
			constructor(readonly client: Client) {}

			${methods.join("\n\n")}
		}
	`

	return result
}
