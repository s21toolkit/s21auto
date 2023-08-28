import { subcommands } from "cmd-ts"
import { generateCommand } from "@/cli/commands/client/generate"

export const clientCommand = subcommands({
	name: "client",
	description: "s21client tooling",
	cmds: {
		generate: generateCommand,
	},
})
