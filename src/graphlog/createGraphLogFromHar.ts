import { pipe } from "effect"
import { Har } from "har-format"
import { GqlRequest } from "@/gql/GqlRequest"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { createGraphLog } from "."

export function createGraphLogFromHar(har: Har) {
	const filteredHar = pipe(
		har,
		(har) => filter(har, isGqlRequest),
		(har) => filter(har, isHttpOk),
	)

	const result = createGraphLog()

	for (const entry of filteredHar.log.entries) {
		const requestData = entry.request.postData?.text

		if (!requestData) continue

		const { operationName, query, variables } = JSON.parse(
			requestData,
		) as GqlRequest

		const response = entry.response.content.text

		if (!response) {
			continue
		}

		result.entries.push({
			operation: operationName,
			query,
			variables: JSON.stringify(variables),
			response,
		})
	}

	return result
}
