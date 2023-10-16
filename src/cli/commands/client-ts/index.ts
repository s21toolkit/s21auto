import { subcommands } from "cmd-ts"
import { generateCommand } from "@/cli/commands/client-ts/generate"

export const clientTsCommand = subcommands({
	name: "client-ts",
	description: "s21client-ts tooling",
	cmds: {
		generate: generateCommand,
	},
})
