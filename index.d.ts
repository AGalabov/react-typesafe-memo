/// <reference types="@types/react" />

declare namespace React {
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
  ): NamedExoticComponent<PropsWithMemo<P>>;
  function memo<T extends ComponentType<any>>(
    Component: T,
    propsAreEqual?: (
      prevProps: Readonly<ComponentProps<T>>,
      nextProps: Readonly<ComponentProps<T>>
    ) => boolean
  ): LocalMemoExoticComponent<T>;

  function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
  ): Memoed<T>;

  function useMemo<T>(
    factory: () => T,
    deps: DependencyList | undefined
  ): Memoed<T>;
}
