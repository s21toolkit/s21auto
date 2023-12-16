import { pipe } from "effect"
import { Har } from "har-format"
import { getMethodName } from "@/codegen/golang/getMethodName"
import { filter, isGqlRequest, isHttpOk } from "@/har/filter"
import { getApiOperations } from "@/har/getApiOperations"
import { merge } from "@/har/merge"

export function fetchHarMethods(hars: Har[]) {
	if (hars.length === 0) return []

	const [first, ...rest] = hars

	const har = pipe(
		merge(first, ...rest),
		(har) => filter(har, isGqlRequest),
		(har) => filter(har, isHttpOk),
	)

	const operations = getApiOperations(har)

	const methods = Array.from(operations).map(([operation]) =>
		getMethodName(operation),
	)

	return methods
}
