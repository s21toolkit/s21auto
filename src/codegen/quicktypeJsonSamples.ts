import {
	combineRenderResults,
	InputData,
	jsonInputForTargetLanguage,
	Options,
	quicktypeMultiFileSync,
	TargetLanguage,
} from "quicktype-core"

export function quicktypeJsonSamples(
	lang: TargetLanguage,
	options: Partial<Omit<Options, "lang" | "inputData">>,
	jsonSamples: string[],
	name: string,
) {
	const inputData = new InputData()

	inputData.addSourceSync("json", { name, samples: jsonSamples }, () =>
		jsonInputForTargetLanguage(lang),
	)

	const renders = quicktypeMultiFileSync({
		lang,
		inputData,
		...options,
	})

	const render = combineRenderResults(renders)

	return render.lines.join("\n")
}
