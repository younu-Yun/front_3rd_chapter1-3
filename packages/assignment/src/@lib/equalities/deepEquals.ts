// deepEquals 함수는 두 값의 깊은 비교를 수행합니다.
export function deepEquals(objA: any, objB: any): boolean {
  // 1. 기본 타입이거나 null인 경우 처리
  if (objA === objB) {
    return true;
  }

  if (objA === null && objB === null) {
    return true;
  }

  // 2. 둘 다 객체인 경우:
  //    - 배열인지 확인
  //    - 객체의 키 개수가 다른 경우 처리
  //    - 재귀적으로 각 속성에 대해 deepEquals 호출

  if (Array.isArray(objA) && Array.isArray(objB)) {
    if (objA.length !== objB.length) {
      return false;
    }
    for (let i = 0; i < objA.length; i++) {
      if (!deepEquals(objA[i], objB[i])) {
        return false;
      }
    }

    return true;
  }

  if (typeof objA === "object" && typeof objB === "object") {
    if (Object.keys(objA).length !== Object.keys(objB).length) {
      return false;
    }

    for (const key of Object.keys(objA)) {
      if (!deepEquals(objA[key], objB[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
