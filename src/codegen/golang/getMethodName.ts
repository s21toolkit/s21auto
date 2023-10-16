export function getMethodName(operation: string) {
	return `${operation[0].toUpperCase()}${operation.slice(1)}`
}
