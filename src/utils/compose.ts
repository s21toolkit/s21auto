export function compose<A, B>(fn: (a: A) => B) {
	return {
		then<C>(g: (x: C) => A) {
			return compose((arg: C) => fn(g(arg)))
		},
		build: () => fn,
		call: (arg: A) => fn(arg),
	}
}

export namespace compose {
	export const then = compose
}
