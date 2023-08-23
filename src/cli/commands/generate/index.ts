import { writeFile } from "fs/promises"
import { resolve } from "path"
import { command, option } from "cmd-ts"
import { ExistingPath } from "cmd-ts/batteries/fs"
import { Entry, Har } from "har-format"
import { harFiles } from "@/cli/arguments/HarFile"
import { generate } from "@/cli/commands/generate/generate"
import { GqlRequest } from "@/gql/GqlRequest"
import { GqlResponse } from "@/gql/GqlResponse"
import { combineHars } from "@/har/combineHars"
import { isGqlApiRequest } from "@/har/isGqlApiRequest"

export const generateCommand = command({
	name: "generate",
	description: "Generate request source code for s21client",
	args: {
		...harFiles,
		outDir: option({
			short: "o",
			long: "out-dir",
			defaultValue: () => process.cwd(),
			description: "Output file directory",
			type: ExistingPath,
		}),
	},
	async handler({ harFirst, harRest, outDir }) {
		const har = combineHars([harFirst, ...harRest])

		const operations = getApiOperations(har)

		const fsWrites: Promise<void>[] = []

		for (const [operationName, entries] of operations) {
			const requestDataSamples = entries.map(
				(entry) => JSON.parse(entry.request.postData?.text!) as GqlRequest,
			)

			const responseDataSamples = entries.map(
				(entry) => JSON.parse(entry.response.content.encoding === "base64" ? atob(entry.response.content.text!) : entry.response.content.text!) as GqlResponse,
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

			const path = resolve(outDir, filename)

			const promise = writeFile(path, result)

			fsWrites.push(promise)
		}

		await Promise.all(fsWrites)
	},
})

function getApiOperations(har: Har) {
	const apiEntries = har.log.entries.filter(isGqlApiRequest).filter(e => e.response.status == 200)

	const operations = new Map<string, [Entry, ...Entry[]]>()

	for (const entry of apiEntries) {
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