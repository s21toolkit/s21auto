import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"
import { filter } from "./filter"

export namespace deprecate {
	export type Options = {
		operations: (string | RegExp)[]
	}
}

export function deprecate(options: deprecate.Options): GraphLogTransformer {
	return filter({
		filter: (entry) => {
			let result = true

			for (const operation of options.operations) {
				if (operation instanceof RegExp) {
					result &&= !operation.test(entry.operation)
				} else {
					result &&= operation !== entry.operation
				}

				if (!result) {
					return false
				}
			}

			return true
		},
	})
}
