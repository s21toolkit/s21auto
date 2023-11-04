import { writeFile } from "fs/promises"
import { command, option } from "cmd-ts"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { generateApiContext } from "@/cli/commands/client-ts/generate/generateApiContext"
import { generateApiContextMethod } from "@/cli/commands/client-ts/generate/generateApiContextMethod"
import { generateApiFile } from "@/cli/commands/client-ts/generate/generateApiFile"
import { generateApiNamespace } from "@/cli/commands/client-ts/generate/generateApiNamespace"
import { generateOperationNamespace } from "@/cli/commands/client-ts/generate/generateOperationNamespace"
import { getDataSamples } from "@/codegen/getDataSamples"
import { getApiOperations } from "@/har/getApiOperations"
import { merge } from "@/har/merge"

export const generateCommand = command({
	name: "generate",
	description: "Generate request source code for s21client-ts",
	args: {
		...harFiles,
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output api file",
			defaultValue: () => "api.ts",
			type: NewFile,
		}),
	},
	async handler(argv) {
		const har = merge(argv.harFirst, ...argv.harRest)

		const operations = getApiOperations(har)

		const operationNamespaces: string[] = []
		const apiContextMethods: string[] = []

		for (const [name, entries] of operations) {
			const { requestSamples, responseSamples } = getDataSamples(entries)

			if (requestSamples.length === 0 || responseSamples.length === 0) continue

			const query = requestSamples[0].query

			const variableSamples = requestSamples.map((sample) =>
				JSON.stringify(sample.variables),
			)

			const dataSamples = responseSamples.map((sample) =>
				JSON.stringify(sample.data),
			)

			const operationNamespace = generateOperationNamespace({
				name,
				query,
				dataSamples,
				variableSamples,
			})

			operationNamespaces.push(operationNamespace)

			const apiContextMethod = generateApiContextMethod(name)

			apiContextMethods.push(apiContextMethod)
		}

		const apiNamespace = generateApiNamespace(operationNamespaces)

		const apiContext = generateApiContext(apiContextMethods)

		const apiFile = generateApiFile(apiNamespace, apiContext)

		await writeFile(argv.outFile, apiFile)
	},
})
