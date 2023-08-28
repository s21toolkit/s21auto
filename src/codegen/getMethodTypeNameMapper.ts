export function getMethodTypeNameMapper(method: string) {
	return function (type: string) {
		return `${type}_${method}`
	}
}
