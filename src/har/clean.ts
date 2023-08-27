import { Har } from "har-format"
import { produce } from "immer"

export function clean(har: Har) {
	return produce(har, (draft) => {
		for (const entry of draft.log.entries) {
			for (const key in entry) {
				if (key.startsWith("_")) {
					delete entry[key as keyof typeof entry]
				}
			}
		}
	})
}
