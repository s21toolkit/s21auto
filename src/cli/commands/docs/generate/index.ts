import { writeFile } from "fs/promises"
import { command, option } from "cmd-ts"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { generateDocument } from "@/cli/commands/docs/generate/generateDocument"
import { generateIndexSection } from "@/cli/commands/docs/generate/generateIndexSection"
import { generateOperationSection } from "@/cli/commands/docs/generate/generateOperationSection"
import { getDataSamples } from "@/codegen/getDataSamples"
import { getApiOperations } from "@/har/getApiOperations"
import { merge } from "@/har/merge"

export const generateCommand = command({
	name: "generate",
	description:
		"Generates API operation documentation in a single markdown file",
	args: {
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output documentation (markdown) file",
			defaultValue: () => "docs.md",
			type: NewFile,
		}),
		...harFiles,
	},
	async handler(argv) {
		const har = merge(argv.harFirst, ...argv.harRest)

		const operations = getApiOperations(har)

		const operationNames: string[] = []
		const operationSections: string[] = []

		for (const [name, entries] of operations) {
			const { requestSamples, responseSamples } = getDataSamples(entries)

			if (requestSamples.length === 0 || responseSamples.length === 0) continue

			operationNames.push(name)

			const query = requestSamples[0].query

			const variableSamples = requestSamples.map((sample) =>
				JSON.stringify(sample.variables),
			)

			const dataSamples = responseSamples.map((sample) =>
				JSON.stringify(sample.data),
			)

			const section = generateOperationSection({
				name,
				query,
				dataSamples,
				variableSamples,
			})

			operationSections.push(section)
		}

		const indexSection = generateIndexSection(operationNames)

		const document = generateDocument(indexSection, operationSections)

		await writeFile(argv.outFile, document)
	},
})
