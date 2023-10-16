import { array, command, multioption, string } from "cmd-ts"
import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { outDir } from "@/cli/arguments/outDir"
import { HarFile } from "@/cli/arguments/types/HarFile"
import { fetchHarMethods } from "@/cli/commands/adapter/generate/fetchHarMethods"
import { generateMethodFile } from "@/cli/commands/adapter/generate/generateMethodFile"
import { getMethodFileName } from "@/codegen/golang/getMethodFileName"

export const generateCommand = command({
	name: "generate",
	description:
		"Generate s21adapter handlers for specified methods (as in s21client)",
	args: {
		hars: multioption({
			short: "h",
			long: "har",
			description: "HAR file(s) to fetch methods from",
			type: array(HarFile),
		}),
		methods: multioption({
			short: "m",
			long: "method",
			type: array(string),
		}),
		...outDir,
	},
	async handler(argv) {
		const methods = argv.methods.concat(fetchHarMethods(argv.hars))

		const fsWrites: Promise<void>[] = []

		for (const method of methods) {
			const result = generateMethodFile(method)

			const filename = getMethodFileName(method)

			const path = resolve(argv.outDir, filename)

			const promise = writeFile(path, result)

			fsWrites.push(promise)
		}

		await Promise.all(fsWrites)
	},
})
