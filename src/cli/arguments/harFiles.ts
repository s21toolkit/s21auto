import { positional, restPositionals } from "cmd-ts"
import { HarFile } from "@/cli/arguments/types/HarFile"

// One or more positional har file arguments as two arguments
export const harFiles = {
	harFirst: positional({
		description: "HAR file to analyze",
		displayName: "har file",
		type: HarFile,
	}),
	harRest: restPositionals({
		description: "Additional HAR files to analyze",
		displayName: "har files",
		type: HarFile,
	}),
}
