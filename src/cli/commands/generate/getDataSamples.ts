import { Entry } from "har-format"
import { GqlRequest } from "@/gql/GqlRequest"
import { GqlResponse } from "@/gql/GqlResponse"

export function getDataSamples(entries: [Entry, ...Entry[]]) {
	const requestSamples = entries
		.map((entry) => entry.request.postData?.text)
		.filter(Boolean)
		.map((data) => JSON.parse(data) as GqlRequest)

	const responseSamples = entries
		.map((entry) => entry.response.content)
		.filter((content) => Boolean(content.text))
		.map((content) =>
			content.encoding === "base64" ? atob(content.text!) : content.text!,
		)
		.map((data) => JSON.parse(data) as GqlResponse)

	return { requestSamples, responseSamples }
}
