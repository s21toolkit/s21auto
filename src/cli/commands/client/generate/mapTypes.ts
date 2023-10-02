const TYPEDEF_PATTERN = /(?<=type\s+)([\w\d_]+)/g

function fetchTypes(source: string) {
	const types = source.matchAll(TYPEDEF_PATTERN)

	return Array.from(types).map((match) => match[0])
}

export function mapTypes(source: string, mapper: (type: string) => string) {
	const types = fetchTypes(source)

	const result = types.reduce((source, type) => {
		const typePattern = new RegExp(String.raw`(?<!\t)\b${type}\b`, "g")

		const mappedType = mapper(type)

		return source.replaceAll(typePattern, mappedType)
	}, source)

	return result
}
