import { pipe } from "effect"
import { TypeScriptTargetLanguage } from "quicktype-core"
import { quicktypeJsonSamples } from "@/codegen/quicktypeJsonSamples"
import { replaceAnyWithUnknown } from "@/codegen/typescript/replaceAnyWithUnknown"

export function generateTypes(jsonSamples: string[], name: string) {
	const rawTypes = quicktypeJsonSamples(
		new TypeScriptTargetLanguage(),
		{
			rendererOptions: {
				"just-types": true,
				"prefer-types": true,
			},
			inferEnums: false,
			inferDateTimes: true,
			inferIntegerStrings: true,
			inferBooleanStrings: true,
			inferUuids: true,
		},
		jsonSamples,
		name,
	)

	return pipe(rawTypes, replaceAnyWithUnknown)
}
