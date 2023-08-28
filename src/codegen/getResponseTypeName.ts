export function getResponseTypeName(type: string) {
	if (type.startsWith("Data_")) {
		return type
	}

	return `Data_${type}`
}
