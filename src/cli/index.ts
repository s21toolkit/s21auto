import { subcommands } from "cmd-ts"
import { generateCommand } from "@/cli/commands/generate"

export const cli = subcommands({
	name: "s21auto",
	description: "Multipurpose traffic analyzer for edu.21-school.ru",
	cmds: {
		generate: generateCommand,
	},
})
