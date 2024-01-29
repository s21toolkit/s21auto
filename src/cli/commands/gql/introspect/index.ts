import { fetchAccessToken } from "@s21toolkit/client"
import { command, option } from "cmd-ts"
import { INTROSPECTION_QUERY } from "./introspectionQuery"

const GQL_ENDPOINT = "https://edu.21-school.ru/services/graphql"

export const introspectCommand = command({
	name: "introspect",
	description: "Queries GQL type schemas",
	args: {
		username: option({
			long: "username",
			short: "u",
			description: "Platform account username",
		}),
		password: option({
			long: "password",
			short: "p",
			description: "Platform account password",
		}),
	},
	async handler(argv) {
		const token = await fetchAccessToken(argv.username, argv.password)

		const response = await fetch(GQL_ENDPOINT, {
			method: "POST",
			body: JSON.stringify({
				query: INTROSPECTION_QUERY,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token.accessToken}`,
			},
		})

		if (!response.ok) {
			console.log("Error:", response.status, response.statusText)
		}

		console.log(await response.text())
	},
})
