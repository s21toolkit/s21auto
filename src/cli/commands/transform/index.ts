import { writeFile } from "fs/promises"
import { command, flag, number, option, optional, string } from "cmd-ts"
import { harFiles } from "@/cli/arguments/harFiles"
import { outFile } from "@/cli/arguments/outFile"
import { clean } from "@/har/clean"
import { filter, isGqlRequest } from "@/har/filter"
import { merge } from "@/har/merge"

export const transformCommand = command({
	name: "transform",
	description: "Transform HAR file(s)",
	args: {
		filterGql: flag({
			short: "q",
			long: "filter:gql",
			description: "Filter graphql log entries",
		}),
		filterUrl: option({
			short: "u",
			long: "filter:url",
			description: "Filter entries by request url",
			type: optional(string),
		}),
		filterStatus: option({
			short: "s",
			long: "filter:status",
			description: "Filter by HTTP response status",
			type: optional(number),
		}),
		clean: flag({
			short: "c",
			long: "clean",
			description: "Remove all unnecessary log data",
		}),
		...outFile,
		...harFiles,
	},
	async handler(argv) {
		let har = merge(argv.harFirst, ...argv.harRest)

		if (argv.filterGql) {
			har = filter(har, isGqlRequest)
		}

		if (argv.filterUrl) {
			har = filter(har, (entry) => entry.request.url.includes(argv.filterUrl!))
		}

		if (argv.filterStatus) {
			har = filter(har, (entry) => entry.response.status === argv.filterStatus!)
		}

		if (argv.clean) {
			har = clean(har)
		}

		await writeFile(argv.outFile, JSON.stringify(har, null, 2))
	},
})
