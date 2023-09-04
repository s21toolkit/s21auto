import { subcommands } from "cmd-ts"
import { generateCommand } from "@/cli/commands/docs/generate"

export const docsCommand = subcommands({
	name: "docs",
	description: "Documentation generator",
	cmds: {
		generate: generateCommand,
	},
})
