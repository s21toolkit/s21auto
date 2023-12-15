import { createGraphLog, GraphLogEntry } from "@/graphlog/GraphLog"
import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"

export function filter(
	predicate: (entry: GraphLogEntry) => boolean,
): GraphLogTransformer {
	return (log) => {
		const result = createGraphLog()

		for (const entry of log.entries) {
			if (!predicate(entry)) {
				continue
			}

			result.entries.push(entry)
		}

		return result
	}
}
