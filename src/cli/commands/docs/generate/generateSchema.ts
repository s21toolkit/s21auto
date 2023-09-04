import { JSONSchemaTargetLanguage } from "quicktype-core"
import { quicktypeJsonSamples } from "@/codegen/quicktypeJsonSamples"

export function generateSchema(jsonSamples: string[], name: string) {
	return quicktypeJsonSamples(
		new JSONSchemaTargetLanguage(),
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
