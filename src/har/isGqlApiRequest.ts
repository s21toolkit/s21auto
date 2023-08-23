import { Entry } from "har-format"
import { S21_GQL_ENDPOINT } from "@/constants"

export function isGqlApiRequest(entry: Entry) {
	return entry.request.url === S21_GQL_ENDPOINT
}
