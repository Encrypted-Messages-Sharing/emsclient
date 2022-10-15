export interface AdditionalParameters {
  onError?: (error: any) => void | Promise<void>
  onLoading?: (state: boolean) => void | Promise<void>
  cb?: () => void | Promise<void>
}
export type ActionParametrs<P> = P extends undefined
  ? [] | [AdditionalParameters]
  : [P] | [{ payload: P } & AdditionalParameters]

export type ActionDeclaration = (action?: any) => unknown | Promise<unknown>

export type ActionsDeclaration = Record<string, ActionDeclaration>

export type Action<A extends ActionDeclaration> = (...args: ActionParametrs<Parameters<A>[0]>)
  => Promise<ReturnType<A>>

export type Actions<A extends ActionsDeclaration> = {
  [K in keyof A]: Action<A[K]>
}

const createActions = <A extends ActionsDeclaration>(actions: A) => {

  const convertedActions: Record<string, unknown> = {}

  for (let action in actions) {
    convertedActions[action] = async (args?: any) => {
      try {
        args?.onLoading?.(true)
        const result = await actions[action](args?.payload || args)
        args?.onLoading?.(false)
        return result
      } catch (error) {
        args?.onLoading?.(false)
        if (args && args.onError) args.onError(error)
        else throw error
      } finally {
        args?.cb?.()
      }
    }
  }

  return convertedActions as Actions<A>
}

export default createActions