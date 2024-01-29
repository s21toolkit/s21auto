import * as acorn from "acorn"
import * as walk from "acorn-walk"
import { command, positional } from "cmd-ts"
import { File } from "cmd-ts/batteries/fs"
import * as graphql from "graphql"

function isGqlQuery(value: string) {
	try {
		graphql.parse(value)
	} catch {
		return false
	}

	return true
}

export const extractCommand = command({
	name: "extract",
	description: "Extracts GQL queries from JS source code",
	args: {
		sourceFile: positional({
			description: "Source file to extract queries from",
			type: File,
		}),
	},
	async handler(argv) {
		const sourceText = await Bun.file(argv.sourceFile).text()

		const program = acorn.parse(sourceText, {
			ecmaVersion: "latest",
			sourceType: "module",
		})

		let index = 0

		walk.simple(program, {
			Literal: (node) => {
				if (typeof node.value != "string") {
					return
				}

				if (!isGqlQuery(node.value)) {
					return
				}

				console.log(`# QUERY[${index}]:\n`, node.value)

				index++
			},
		})
	},
})
