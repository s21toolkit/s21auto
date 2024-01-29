import { subcommands } from "cmd-ts"
import { extractCommand } from "./extract"

export const gqlCommand = subcommands({
	name: "gql",
	description: "GQL utilities",
	cmds: {
		extract: extractCommand,
	},
})
