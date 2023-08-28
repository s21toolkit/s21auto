export function getMethodTypeName(method: string) {
	return function (type: string) {
		return `${type}_${method}`
	}
}
