import { Header } from "har-format"

export function getHeaderMap(headers: Header[]) {
	return headers
		.filter((header) =>
			["cookie", "schoolid", "accept"].includes(header.name.toLowerCase()),
		)
		.reduce<Record<string, string>>((headers, header) => {
			headers[header.name] = header.value
			return headers
		}, {})
}

export function getId() {
	return crypto.randomUUID().replace(/-/g, "")
}

export function getDateUnix() {
	return Math.floor(new Date().getTime() / 1000)
}

export function getSortKey() {
	return -Math.floor(Math.random() * 999999999)
}
