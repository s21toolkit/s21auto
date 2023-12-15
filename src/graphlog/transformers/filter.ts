import { createGraphLog, GraphLogEntry } from "@/graphlog/GraphLog"
import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"

export namespace filter {
	export type Options = {
		filter: (entry: GraphLogEntry) => boolean
	}
}

export function filter(options: filter.Options): GraphLogTransformer {
	return (log) => {
		const result = createGraphLog()

		for (const entry of log.entries) {
			if (!options.filter(entry)) {
				continue
			}

			result.entries.push(entry)
		}

		return result
	}
}
