import { subcommands } from "cmd-ts"
import { extractCommand } from "./extract"
import { introspectCommand } from "./introspect"

export const gqlCommand = subcommands({
	name: "gql",
	description: "GQL utilities",
	cmds: {
		extract: extractCommand,
		introspect: introspectCommand,
	},
})
