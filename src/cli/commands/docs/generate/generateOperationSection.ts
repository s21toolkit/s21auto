import { source } from "common-tags"
import { generateSchema } from "@/cli/commands/docs/generate/generateSchema"
import { OperationData } from "@/gql/OperationData"

export function generateOperationSection(operation: OperationData) {
	const { name, query, variableSamples, dataSamples } = operation

	const variableSchema = generateSchema(variableSamples, "Variables")
	const dataSchema = generateSchema(dataSamples, "Data")

	const result = source`
		### ${name}

		<details>
		<summary> Query </summary>

		\`\`\`
		${query}
		\`\`\`

		</details>

		<details>
		<summary> Variables </summary>

		\`\`\`json
		${variableSchema}
		\`\`\`

		</details>

		<details>
		<summary> Data </summary>

		\`\`\`json
		${dataSchema}
		\`\`\`

		</details>

		[[Index](#index)]
	`

	return result
}
