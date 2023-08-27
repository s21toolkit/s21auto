import { subcommands } from "cmd-ts"
import { exportCommand } from "@/cli/commands/export"
import { generateCommand } from "@/cli/commands/generate"
import { transformCommand } from "@/cli/commands/transform"

export const cli = subcommands({
	name: "s21auto",
	description: "Multipurpose traffic analyzer for edu.21-school.ru",
	cmds: {
		export: exportCommand,
		generate: generateCommand,
		transform: transformCommand,
	},
})
