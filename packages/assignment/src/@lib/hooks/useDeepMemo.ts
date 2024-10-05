import { DependencyList } from "react";
import { useMemo } from "./useMemo";
import { deepEquals } from "../equalities";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  // 직접 작성한 useMemo를 참고해서 만들어보세요.
  return useMemo(factory, deps, deepEquals)
}
