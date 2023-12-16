import { readFileSync, writeFileSync } from "fs"
import { extname } from "path"
import { command, option, positional } from "cmd-ts"
import { File } from "cmd-ts/batteries/fs"
import { Har } from "har-format"
import { NewFile } from "@/cli/arguments/types/NewFile"
import { createGraphLogFromHar, GraphLog, GraphLogBuilder } from "@/graphlog"

namespace GraphLogUtils {
	export function loadLog(path: string) {
		const rawData = readFileSync(path, { encoding: "utf-8" })

		const data = JSON.parse(rawData)

		if (extname(path) === ".har") {
			return createGraphLogFromHar(data as Har)
		}

		return data as GraphLog
	}
}

type Script = (log: GraphLogBuilder, utils: typeof GraphLogUtils) => void

export const runScriptCommand = command({
	name: "run-script",
	aliases: ["@"],
	description: "Executes GraphLog script",
	args: {
		script: positional({
			displayName: "script",
			description: "JS/TS file",
			type: File,
		}),
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output GraphLog file",
			type: NewFile,
		}),
	},
	async handler(argv) {
		const script: Script = (await import(argv.script)).default

		const logBuilder = new GraphLogBuilder()

		await script(logBuilder, GraphLogUtils)

		writeFileSync(argv.outFile, JSON.stringify(logBuilder.graphLog), {
			encoding: "utf-8",
		})
	},
})
