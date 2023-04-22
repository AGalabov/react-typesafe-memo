declare global {
  namespace React {
    type Memoed<T> = T extends { __brand: "memoized" }
      ? T
      : T extends Record<string, unknown>
      ? { [key in keyof T]: Memoed<T[key]> } & { __brand: "memoized" }
      : T & { __brand: "memoized" };

    type WithMemo<P> = P extends string
      ? P
      : P extends number
      ? P
      : P extends boolean
      ? P
      : P extends ReactElement
      ? P
      : Memoed<P>;

    type PropsWithMemo<P> = P extends object
      ? { [key in keyof P]: WithMemo<P[key]> }
      : {};

    type LocalComponentPropsWithRef<T extends ElementType> =
      T extends ComponentClass<infer P>
        ? PropsWithMemo<PropsWithoutRef<P> & RefAttributes<InstanceType<T>>>
        : PropsWithMemo<PropsWithRef<ComponentProps<T>>>;

    // will show `Memo(${Component.displayName || Component.name})` in devtools by default,
    // but can be given its own specific name
    type LocalMemoExoticComponent<T extends ComponentType<any>> =
      NamedExoticComponent<LocalComponentPropsWithRef<T>> & {
        readonly type: T;
      };

    function memo<P extends object>(
      Component: FunctionComponent<P>,
      propsAreEqual?: (
        prevProps: Readonly<PropsWithChildren<P>>,
        nextProps: Readonly<PropsWithChildren<P>>
      ) => boolean
    ): NamedExoticComponent<P>;
    function memo<T extends ComponentType<any>>(
      Component: T,
      propsAreEqual?: (
        prevProps: Readonly<ComponentProps<T>>,
        nextProps: Readonly<ComponentProps<T>>
      ) => boolean
    ): LocalMemoExoticComponent<T>;

    // I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
    // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
    /**
     * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
     * has changed.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usecallback
     */
    // TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
    function useCallback<T extends (...args: any[]) => any>(
      callback: T,
      deps: DependencyList
    ): Memoed<T>;
    /**
     * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
     *
     * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
     * the second argument.
     *
     * ```ts
     * function expensive () { ... }
     *
     * function Component () {
     *   const expensiveResult = useMemo(expensive, [expensive])
     *   return ...
     * }
     * ```
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usememo
     */

    // allow undefined, but don't make it optional as that is very likely a mistake
    function useMemo<T>(
      factory: () => T,
      deps: DependencyList | undefined
    ): Memoed<T>;
  }
}

export {};
