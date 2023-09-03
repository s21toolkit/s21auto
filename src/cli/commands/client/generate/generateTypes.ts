import {
	combineRenderResults,
	GoTargetLanguage,
	InputData,
	jsonInputForTargetLanguage,
	quicktypeMultiFileSync,
} from "quicktype-core"

export function generateTypes(jsonSamples: string[], name: string) {
	const inputData = new InputData()

	const lang = new GoTargetLanguage()

	inputData.addSourceSync("json", { name, samples: jsonSamples }, () =>
		jsonInputForTargetLanguage(lang),
	)

	const renders = quicktypeMultiFileSync({
		lang,
		inputData,
		rendererOptions: {
			"just-types": true,
		},
		inferEnums: false,
	})

	const render = combineRenderResults(renders)

	return render.lines.join("\n")
}
