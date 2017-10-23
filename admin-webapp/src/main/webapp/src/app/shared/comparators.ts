export function comparator(fn) {
  return function(a, b) {
    return fn(a, b) ? -1 : fn(b, a) ? 1 : 0;
  }
}

export function lessThan(a, b) {
  return a < b;
}

export function greaterThan(a, b) {
  return a > b;
}

export let lessThanComparator = comparator(lessThan);
export let greaterThanComparator = comparator(greaterThan);

export function sortAscOn(sortable, ...getters) {
  return sortOn(sortable, lessThanComparator, getters);
}

export function sortDescOn(sortable, ...getters) {
  return sortOn(sortable, greaterThanComparator, getters);
}

export function sortOn(sortable, order, getters) {
  return sortable.sort((a, b) => {
    for (let i = 0; i < getters.length; i++) {
      let getter = getters[i];
      let comparison = order(getter(a), getter(b));
      if (comparison != 0) {
        return comparison;
      }
    }
    return 0;
  })
}
