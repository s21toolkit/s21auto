import { source } from "common-tags"
import { MARKDOWN_CODEGEN_WARNING } from "@/codegen/markdown/codegenWarning"

export function generateDocument(index: string, operations: string[]) {
	const result = source`
		${MARKDOWN_CODEGEN_WARNING}
		# School 21 GQL Operations

		## Index

		${index}

		## Operations

		${operations.join("\n\n")}
	`

	return result
}
