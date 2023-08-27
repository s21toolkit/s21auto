export function pipe<A, B>(fn: (a: A) => B) {
	return {
		then<C>(g: (x: B) => C) {
			return pipe((arg: A) => g(fn(arg)))
		},
		done: () => fn,
		call: (arg: A) => fn(arg),
	}
}

export namespace pipe {
	export function of<T>(val: T) {
		return pipe((_: void) => val)
	}

	export function from<T>() {
		return pipe((_: T) => _)
	}

	export const then = pipe
}
