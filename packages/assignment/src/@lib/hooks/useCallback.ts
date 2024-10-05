import { DependencyList } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export function useCallback<T extends (...args: any[]) => any>(factory: T, deps: DependencyList): T {
  // 직접 작성한 useMemo를 통해서 만들어보세요.
  return ((...args) => factory(...args)) as T
}
