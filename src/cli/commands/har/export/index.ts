import { writeFile } from "fs/promises"
import { command, option, string } from "cmd-ts"
import { pipe } from "effect"
import { Har } from "har-format"
import { harFiles } from "@/cli/arguments/harFiles"
import { NewFile } from "@/cli/arguments/types/NewFile"
import {
	createCollection,
	createEnvironment,
	createRequest,
	createWorkspace,
} from "@/cli/commands/har/export/templates"
import { GqlRequest } from "@/gql/GqlRequest"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { merge } from "@/har/merge"

export const exportCommand = command({
	name: "export",
	description: "Export log entries to Insomnia collection",
	args: {
		workspace: option({
			short: "w",
			long: "workspace",
			description: "Generated workspace name",
			type: string,
			defaultValue: () => "Generated",
		}),
		outFile: option({
			short: "o",
			long: "out-file",
			description: "Output insomnia collection file",
			defaultValue: () => "collection.json",
			type: NewFile,
		}),
		...harFiles,
	},
	async handler(argv) {
		const har = pipe(
			merge(argv.harFirst, ...argv.harRest),
			(har) => filter(har, isGqlRequest),
			(har) => filter(har, isHttpOk),
		)

		const workspace = createWorkspace({
			name: argv.workspace,
		})

		const environment = createEnvironment(workspace)

		const collection = createCollection([workspace, environment])

		const schoolId = extractSchoolId(har)

		if (schoolId) {
			environment.data.schoolid = schoolId
		}

		const operations = new Set()

		for (const entry of har.log.entries) {
			const requestData = entry.request.postData?.text

			if (!requestData) continue

			const gql = JSON.parse(requestData) as GqlRequest

			if (operations.has(gql.operationName)) continue

			collection.resources.push(
				createRequest({
					name: gql.operationName,
					body: {
						mimeType: "application/graphql",
						text: requestData,
					},
					url: entry.request.url,
					headers: [
						{
							name: "schoolid",
							value: "{{ _.schoolid }}",
						},
						{
							name: "content-type",
							value: "application/json",
						},
					],
				}),
			)

			operations.add(gql.operationName)
		}

		await writeFile(argv.outFile, JSON.stringify(collection, null, 2))
	},
})

function extractSchoolId(har: Har) {
	const getRolesEntry = har.log.entries.find(
		(e) => e.request.postData?.text?.includes("userRoleLoaderGetRoles"),
	)

	if (!getRolesEntry) return undefined

	const responseText = getRolesEntry.response.content.text

	if (!responseText) return undefined

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = JSON.parse(responseText) as any

	const schoolId: string | undefined =
		data?.data?.user?.getCurrentUser?.studentRoles?.[0]?.school?.id

	return schoolId
}
