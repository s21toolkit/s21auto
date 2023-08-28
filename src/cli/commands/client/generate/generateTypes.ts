import {
	GoTargetLanguage,
	InputData,
	jsonInputForTargetLanguage,
	quicktype,
} from "quicktype-core"

export async function generateTypes(jsonSamples: string[], name: string) {
	const inputData = new InputData()

	const lang = new GoTargetLanguage()

	await inputData.addSource("json", { name, samples: jsonSamples }, () =>
		jsonInputForTargetLanguage(lang),
	)

	const render = await quicktype({
		lang,
		inputData,
		rendererOptions: {
			"just-types": true,
		},
		inferEnums: false,
	})

	return render.lines.join("\n")
}
