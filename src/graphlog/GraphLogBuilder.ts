import { createGraphLog, GraphLog } from "./GraphLog"

export type GraphLogTransformer = (log: GraphLog) => GraphLog

export class GraphLogBuilder {
	constructor(public graphLog: GraphLog = createGraphLog()) {}

	apply(transformer: GraphLogTransformer) {
		const transformedLog = transformer(this.graphLog)

		this.graphLog = transformedLog

		return this
	}
}
