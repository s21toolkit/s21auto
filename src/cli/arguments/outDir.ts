import { option } from "cmd-ts"
import { ExistingPath } from "cmd-ts/batteries/fs"

export const outDir = {
	outDir: option({
		short: "o",
		long: "out-dir",
		defaultValue: () => process.cwd(),
		description: "Output file directory",
		type: ExistingPath,
	}),
}
