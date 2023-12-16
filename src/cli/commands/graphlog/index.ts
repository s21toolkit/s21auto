import { subcommands } from "cmd-ts"
import { runScriptCommand } from "./run-script"

export const graphlogCommand = subcommands({
	name: "graphlog",
	description: "GraphLog tool for GraphQL HTTP logs analysis",
	cmds: {
		"run-script": runScriptCommand,
	},
})
