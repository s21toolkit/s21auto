import { GoTargetLanguage } from "quicktype-core"
import { quicktypeJsonSamples } from "@/codegen/quicktypeJsonSamples"

export function generateTypes(jsonSamples: string[], name: string) {
	return quicktypeJsonSamples(
		new GoTargetLanguage(),
		{
			rendererOptions: {
				"just-types": true,
			},
			inferEnums: false,
		},
		jsonSamples,
		name,
	)
}
