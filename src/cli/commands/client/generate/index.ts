import { writeFile } from "fs/promises"
import { resolve } from "path"
import { command } from "cmd-ts"
import { harFiles } from "@/cli/arguments/harFiles"
import { outDir } from "@/cli/arguments/outDir"
import { generateRequestFile } from "@/cli/commands/client/generate/generateRequestFile"
import { getApiOperations } from "@/cli/commands/client/generate/getApiOperatons"
import { getDataSamples } from "@/cli/commands/client/generate/getDataSamples"
import { merge } from "@/har/merge"

export const generateCommand = command({
	name: "generate",
	description: "Generate request source code for s21client",
	args: {
		...harFiles,
		...outDir,
	},
	async handler(argv) {
		const har = merge(argv.harFirst, ...argv.harRest)

		const operations = getApiOperations(har)

		const fsWrites: Promise<void>[] = []

		for (const [operation, entries] of operations) {
			const { requestSamples, responseSamples } = getDataSamples(entries)

			if (requestSamples.length === 0 || responseSamples.length === 0) continue

			const query = requestSamples[0].query

			const variableSamples = requestSamples.map((sample) =>
				JSON.stringify(sample.variables),
			)

			const dataSamples = responseSamples.map((sample) =>
				JSON.stringify(sample.data),
			)

			const result = await generateRequestFile({
				operation,
				query,
				dataSamples,
				variableSamples,
			})

			const filename = getFileName(operation)

			const path = resolve(argv.outDir, filename)

			const promise = writeFile(path, result)

			fsWrites.push(promise)
		}

		await Promise.all(fsWrites)
	},
})

function getFileName(operation: string) {
	const base = operation.replaceAll(/(?<=[a-z])([A-Z])/g, "_$1").toLowerCase()

	return `${base}.go`
}
