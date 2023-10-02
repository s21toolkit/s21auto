export function getRequestTypeName(type: string) {
	if (type === "Variables") {
		return type
	}

	return `Variables_${type}`
}
