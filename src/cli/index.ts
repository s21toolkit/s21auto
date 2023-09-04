import { subcommands } from "cmd-ts"
import { adapterCommand } from "@/cli/commands/adapter"
import { clientCommand } from "@/cli/commands/client"
import { docsCommand } from "@/cli/commands/docs"
import { harCommand } from "@/cli/commands/har"

export const cli = subcommands({
	name: "s21auto",
	description: "Multipurpose CLI for s21toolkit",
	cmds: {
		har: harCommand,
		client: clientCommand,
		adapter: adapterCommand,
		docs: docsCommand,
	},
})
