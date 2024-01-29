import { subcommands } from "cmd-ts"
import { adapterCommand } from "@/cli/commands/adapter"
import { clientCommand } from "@/cli/commands/client"
import { clientTsCommand } from "@/cli/commands/client-ts"
import { docsCommand } from "@/cli/commands/docs"
import { harCommand } from "@/cli/commands/har"
import { gqlCommand } from "./commands/gql"

export const cli = subcommands({
	name: "s21auto",
	description: "Multipurpose CLI for s21toolkit",
	cmds: {
		har: harCommand,
		client: clientCommand,
		"client-ts": clientTsCommand,
		adapter: adapterCommand,
		docs: docsCommand,
		gql: gqlCommand,
	},
})
