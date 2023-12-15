import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"
import { filter } from "./filter"

export function deprecate(
	operations: (string | RegExp)[],
): GraphLogTransformer {
	return filter((entry) => {
		let result = true

		for (const operation of operations) {
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
	})
}
