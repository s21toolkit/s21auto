/**
 * GraphQL communication log format
 */
export type GraphLog = {
	entries: GraphLogEntry[]
}

export type GraphLogEntry = {
	operation: string
	variables: string
	query: string
	response: string
}

export function createGraphLog(): GraphLog {
	return { entries: [] }
}
