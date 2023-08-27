import { Entry, Har } from "har-format"
import { produce } from "immer"

export function isGqlRequest(entry: Entry) {
	return entry.request.url.includes("graphql")
}

export function isHttpOk(entry: Entry) {
	return entry.response.status === 200
}

export function filter(har: Har, predicate: (entry: Entry) => boolean) {
	return produce(har, (draft) => {
		draft.log.entries = draft.log.entries.filter(predicate)
	})
}
