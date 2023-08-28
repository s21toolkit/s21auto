import { subcommands } from "cmd-ts"
import { generateCommand } from "@/cli/commands/adapter/generate"

export const adapterCommand = subcommands({
	name: "adapter",
	description: "s21adapter tooling",
	cmds: {
		generate: generateCommand,
	},
})
