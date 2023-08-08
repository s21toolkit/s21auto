#!/usr/bin/env bun

import {
	binary,
	command,
	extendType,
	positional,
	restPositionals,
	run,
	subcommands,
} from "cmd-ts"
import { File } from "cmd-ts/batteries/fs"
import { Har } from "har-format"
import { readFile } from "node:fs/promises"
import { extname } from "node:path"

const HarFile = extendType(File, {
	async from(path) {
		const extension = extname(path)

		if (extension !== "har") {
			throw new Error("Unsupported file format, expected HAR file")
		}

		const data = await readFile(path, "utf-8")

		const har = JSON.parse(data) as Har

		return har
	},
})

const hars = {
	har: positional({
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

const cli = binary(
	subcommands({
		name: "s21auto",
		description: "Traffic analyzer for edu.21-school.ru",
		cmds: {
			export: command({
				name: "generate",
				description: "Generate request code for s21client",
				args: {
					...hars,
				},
				handler({ har, harRest }) {},
			}),
		},
	}),
)

run(cli, process.argv)
