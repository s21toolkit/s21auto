export function replaceAnyWithUnknown(source: string) {
	return source.replaceAll(/\bany\b/g, "unknown")
}
