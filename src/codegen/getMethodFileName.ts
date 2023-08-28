export function getMethodFileName(method: string) {
	const base = method.replaceAll(/(?<=[a-z])([A-Z])/g, "_$1").toLowerCase()

	return `${base}.go`
}
