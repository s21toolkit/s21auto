import { Entry } from "har-format"
import { GqlRequest } from "@/gql/GqlRequest"

export function matchGqlOperation(...operations: string[]) {
	return (entry: Entry) => {
		const requestData = entry.request.postData?.text

		if (!requestData) {
			return false
		}

		const gqlRequest = JSON.parse(requestData) as GqlRequest

		const { operationName } = gqlRequest

		return operations.includes(operationName)
	}
}
