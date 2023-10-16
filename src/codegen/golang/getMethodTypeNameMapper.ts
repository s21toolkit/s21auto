export function getMethodTypeNameMapper(method: string) {
	return function (type: string) {
		return `${method}_${type}`
	}
}
