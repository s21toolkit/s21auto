export type GqlRequest<
	V extends Record<string, unknown> = Record<string, unknown>,
> = {
	operationName: string
	variables: V
	query: string
}
