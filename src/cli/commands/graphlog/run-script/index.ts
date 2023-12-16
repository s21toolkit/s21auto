import { readFileSync } from "fs"
import { extname } from "path"
import { command, positional } from "cmd-ts"
import { File } from "cmd-ts/batteries/fs"
import { Har } from "har-format"
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
	},
	async handler(argv) {
		const script: Script = (await import(argv.script)).default

		await script(new GraphLogBuilder(), GraphLogUtils)
	},
})
