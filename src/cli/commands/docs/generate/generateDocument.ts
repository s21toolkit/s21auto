import { source } from "common-tags"

export function generateDocument(index: string, operations: string[]) {
	const result = source`
		# School 21 GQL Operations

		## Index

		${index}

		## Operations

		${operations.join("\n\n")}
	`

	return result
}
