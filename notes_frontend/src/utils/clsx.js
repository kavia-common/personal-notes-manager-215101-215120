 /**
  * PUBLIC_INTERFACE
  * clsx joins truthy classNames into a single string.
  */
export function clsx(...args) {
  return args
    .flatMap(a => Array.isArray(a) ? a : [a])
    .filter(Boolean)
    .join(' ');
}
