import { Entry, Har } from "har-format"
import { GqlRequest } from "@/gql/GqlRequest"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { pipe } from "@/utils/pipe"

export type OperationMap = ReturnType<typeof getApiOperations>

export function getApiOperations(har: Har) {
	const filteredHar = pipe
		.of(har)
		.then((har) => filter(har, isGqlRequest))
		.then((har) => filter(har, isHttpOk))
		.call()

	const operations = new Map<string, [Entry, ...Entry[]]>()

	for (const entry of filteredHar.log.entries) {
		const requestData = entry.request.postData?.text

		if (!requestData) continue

		const { operationName } = JSON.parse(requestData) as GqlRequest

		if (operations.has(operationName)) {
			operations.get(operationName)!.push(entry)
		} else {
			operations.set(operationName, [entry])
		}
	}

	return operations
}
