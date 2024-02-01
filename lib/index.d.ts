import type { ReactNode } from "react"

interface Options {
  components: Record<string, string>
  reviver: (
    type: string,
    props: Record<string, unknown>,
    key: string | number,
    components: Options["components"],
  ) => {
    type: string
    props: Record<string, unknown>
    key: string | number
    components: Options["components"]
  }
}

export function serialize(data: ReactNode): string

export function deserialize(data: string, options?: Partial<Options>): ReactNode
