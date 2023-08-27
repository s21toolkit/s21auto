import { writeFile } from "fs/promises"
import { resolve } from "path"
import { command } from "cmd-ts"
import { Entry, Har } from "har-format"
import { harFiles } from "@/cli/arguments/harFiles"
import { outDir } from "@/cli/arguments/outDir"
import { generate } from "@/cli/commands/generate/generate"
import { GqlRequest } from "@/gql/GqlRequest"
import { GqlResponse } from "@/gql/GqlResponse"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { merge } from "@/har/merge"
import { pipe } from "@/utils/pipe"

export const generateCommand = command({
	name: "generate",
	description: "Generate request source code for s21client",
	args: {
		...harFiles,
		...outDir,
	},
	async handler(argv) {
		const har = pipe
			.of(merge(argv.harFirst, ...argv.harRest))
			.then((har) => filter(har, isGqlRequest))
			.then((har) => filter(har, isHttpOk))
			.call()

		const operations = getApiOperations(har)

		const fsWrites: Promise<void>[] = []

		for (const [operationName, entries] of operations) {
			const requestDataSamples = entries.map(
				(entry) => JSON.parse(entry.request.postData?.text!) as GqlRequest,
			)

			const responseDataSamples = entries.map(
				(entry) =>
					JSON.parse(
						entry.response.content.encoding === "base64"
							? atob(entry.response.content.text!)
							: entry.response.content.text!,
					) as GqlResponse,
			)

			const query = requestDataSamples[0].query

			const variablesSamples = requestDataSamples.map((sample) =>
				JSON.stringify(sample.variables),
			)

			const dataSamples = responseDataSamples.map((sample) =>
				JSON.stringify(sample.data),
			)

			const result = await generate(
				operationName,
				query,
				variablesSamples,
				dataSamples,
			)

			const filename = `${operationName
				.replaceAll(/(?<=[a-z])([A-Z])/g, "_$1")
				.toLowerCase()}.go`

			const path = resolve(argv.outDir, filename)

			const promise = writeFile(path, result)

			fsWrites.push(promise)
		}

		await Promise.all(fsWrites)
	},
})

function getApiOperations(har: Har) {
	const operations = new Map<string, [Entry, ...Entry[]]>()

	for (const entry of har.log.entries) {
		const { operationName } = JSON.parse(
			entry.request.postData?.text!,
		) as GqlRequest

		if (operations.has(operationName)) {
			operations.get(operationName)?.push(entry)
		} else {
			operations.set(operationName, [entry])
		}
	}

	return operations
}
