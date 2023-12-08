import { writeFile } from "fs/promises"
import {
	array,
	command,
	flag,
	multioption,
	number,
	option,
	optional,
	string,
} from "cmd-ts"
import { Har } from "har-format"
import { produce } from "immer"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { matchGqlOperation } from "@/cli/commands/har/transform/matchGqlOperation"
import { GqlRequest } from "@/gql/GqlRequest"
import { clean } from "@/har/clean"
import { filter, isGqlRequest } from "@/har/filter"
import { merge } from "@/har/merge"

export function mergeUnique(target: Har, ...sources: Har[]) {
	if (sources.length === 0) return target

	const uniqueOperations = new Set<string>()

	return produce(target, (draft) => {
		for (const source of sources) {
			const sourceUniqueOperations = new Set<string>()

			for (const entry of source.log.entries) {
				if (!isGqlRequest(entry)) {
					continue
				}

				const requestData = entry.request.postData?.text

				if (!requestData) {
					continue
				}

				const gqlRequest = JSON.parse(requestData) as GqlRequest

				const { operationName } = gqlRequest

				if (uniqueOperations.has(operationName)) {
					continue
				}

				draft.log.entries.push(entry)

				sourceUniqueOperations.add(operationName)
			}

			for (const operation of sourceUniqueOperations) {
				uniqueOperations.add(operation)
			}
		}
	})
}

export const transformCommand = command({
	name: "transform",
	aliases: ["merge", "%"],
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
		filterOperations: multioption({
			short: "p",
			long: "filter:operation",
			type: array(string),
		}),
		filterOutOperations: multioption({
			short: "n",
			long: "filter-out:operation",
			description: "Inverse filter by GQL operation name(s)",
			type: array(string),
		}),
		takeUnique: flag({
			short: "Q",
			long: "take-unique",
			description:
				"When merging, takes only unique (new) GQL operations from each har file in order",
			defaultValue: () => false,
		}),
		clean: flag({
			short: "c",
			long: "clean",
			description: "Remove all unnecessary log data",
		}),
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output HAR file",
			defaultValue: () => "log.har",
			type: NewFile,
		}),
		...harFiles,
	},
	async handler(argv) {
		const mergeStrategy = argv.takeUnique ? mergeUnique : merge

		let har = mergeStrategy(argv.harFirst, ...argv.harRest)

		if (argv.filterGql || argv.filterOperations.length > 0) {
			har = filter(har, isGqlRequest)
		}

		if (argv.filterUrl) {
			har = filter(har, (entry) => entry.request.url.includes(argv.filterUrl!))
		}

		if (argv.filterStatus) {
			har = filter(har, (entry) => entry.response.status === argv.filterStatus!)
		}

		if (argv.filterOperations.length > 0) {
			har = filter(har, matchGqlOperation(...argv.filterOperations))
		}

		if (argv.filterOutOperations.length > 0) {
			har = filter(
				har,
				(entry) => !matchGqlOperation(...argv.filterOutOperations)(entry),
			)
		}

		if (argv.clean) {
			har = clean(har)
		}

		await writeFile(argv.outFile, JSON.stringify(har, null, 2))
	},
})
