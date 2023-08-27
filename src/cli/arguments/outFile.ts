import { option } from "cmd-ts"
import { NewFile } from "@/cli/arguments/types/NewFile"

export const outFile = {
	outFile: option({
		short: "o",
		long: "out-file",
		description: "Output file",
		type: NewFile,
	}),
}
