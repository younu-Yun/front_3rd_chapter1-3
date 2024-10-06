// 얕은 비교 Shallow Compare란?

// 숫자, 문자열 등 원시 자료형은 값을 비교한다.
// 배열, 객체 등 참조 자료형 값 혹은 속성을 비교하지 않고, 참조되는 위치를 비교한다.

// shallowEquals 함수는 두 값의 얕은 비교를 수행합니다.
export function shallowEquals(objA: any, objB: any): boolean {
  // 1. 두 값이 정확히 같은지 확인 (참조가 같은 경우)
  if (objA === objB) {
    return true;
  }

  // 2. 둘 중 하나라도 객체가 아닌 경우 처리 (null도 객체가 아니므로 주의)
  if (typeof objA !== "object" || typeof objB !== "object") {
    return false;
  }

  if (Object.keys(objA).length !== Object.keys(objB).length) {
    return false;
  }

  // 4. 모든 키에 대해 얕은 비교 수행
  for (const key of Object.keys(objA)) {
    // 각 키에 대한 값이 동일한지 확인
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  // 모든 키와 값이 동일하면 true
  return true;
}
