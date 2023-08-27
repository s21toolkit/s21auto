import { Har } from "har-format"
import { produce } from "immer"

export function merge(target: Har, ...sources: Har[]) {
	if (sources.length === 0) return target

	return produce(target, (draft) => {
		for (const source of sources) {
			draft.log.entries.push(...source.log.entries)
		}
	})
}
