export function filterNullGuard<T>(item: null | T): item is T {
  return item != null;
}
