import { GraphLog } from "@/graphlog/GraphLog"
import { GraphLogTransformer } from "@/graphlog/GraphLogBuilder"
import { merge } from "."

export function take(source: GraphLog): GraphLogTransformer {
	return merge({
		strategy: "takeAll",
		priority: "ours",
		source,
	})
}
