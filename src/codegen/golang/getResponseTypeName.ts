export function getResponseTypeName(type: string) {
	if (type === "Data") {
		return type
	}

	return `Data_${type}`
}
