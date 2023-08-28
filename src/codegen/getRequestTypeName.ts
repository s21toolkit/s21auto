export function getRequestTypeName(type: string) {
	if (type.startsWith("Variables_")) {
		return type
	}

	return `Variables_${type}`
}
