import { source } from "common-tags"

export function generateIndexSection(operations: string[]) {
	const result = source`
		${operations.map((operation) => `* [${operation}](#${operation})`)}
	`

	return result
}
