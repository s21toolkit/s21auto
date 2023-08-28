import { subcommands } from "cmd-ts"
import { exportCommand } from "@/cli/commands/har/export"
import { transformCommand } from "@/cli/commands/har/transform"

export const harCommand = subcommands({
	name: "har",
	description: "HAR file manipulations",
	cmds: {
		export: exportCommand,
		transform: transformCommand,
	},
})
