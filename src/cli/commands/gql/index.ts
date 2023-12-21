import { subcommands } from "cmd-ts"
import { inferCommand } from "@/cli/commands/gql/infer"

export const gqlCommand = subcommands({
	name: "gql",
	description: "GraphQL utilities",
	cmds: {
		infer: inferCommand,
	},
})
