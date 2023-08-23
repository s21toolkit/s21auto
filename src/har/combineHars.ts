import { Har } from "har-format"

export function combineHars(hars: [Har, ...Har[]]) {
	const [base, ...rest] = hars

	for (const har of rest) {
		base.log.entries.push(...har.log.entries)
		base.log.pages?.push(...(har.log.pages ?? []))
	}

	return base
}
