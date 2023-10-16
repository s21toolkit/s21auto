import { Har } from "har-format"
import { getMethodName } from "@/codegen/golang/getMethodName"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { getApiOperations } from "@/har/getApiOperations"
import { merge } from "@/har/merge"
import { pipe } from "@/utils/pipe"

export function fetchHarMethods(hars: Har[]) {
	if (hars.length === 0) return []

	const [first, ...rest] = hars

	const har = pipe
		.of(merge(first, ...rest))
		.then((har) => filter(har, isGqlRequest))
		.then((har) => filter(har, isHttpOk))
		.call()

	const operations = getApiOperations(har)

	const methods = Array.from(operations).map(([operation]) =>
		getMethodName(operation),
	)

	return methods
}
