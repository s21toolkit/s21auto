import { createGraphLog, GraphLog } from "@/graphlog/GraphLog"
import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"

namespace strategies {
	type MergeStrategy = (ours: GraphLog, theirs: GraphLog) => GraphLog

	export const takeAll: MergeStrategy = (ours, theirs) => {
		const result = createGraphLog()

		result.entries.push(...ours.entries)
		result.entries.push(...theirs.entries)

		return result
	}

	export const takeUnique: MergeStrategy = (ours, theirs) => {
		const result = createGraphLog()

		const uniqueOperations = new Set<string>()

		for (const entry of ours.entries) {
			uniqueOperations.add(entry.operation)
			result.entries.push(entry)
		}

		for (const entry of theirs.entries) {
			if (uniqueOperations.has(entry.operation)) {
				continue
			}

			result.entries.push(entry)
		}

		return result
	}
}

export namespace merge {
	export type MergeStrategy = keyof typeof strategies
	export type MergePriority = "ours" | "theirs"

	export type Options = {
		strategy: MergeStrategy
		priority: MergePriority
		source: GraphLog
	}
}

export function merge(options: merge.Options): GraphLogTransformer {
	return (log) => {
		const [ours, theirs] =
			options.priority === "ours"
				? [log, options.source]
				: [options.source, log]

		const result = strategies[options.strategy](ours, theirs)

		return result
	}
}
