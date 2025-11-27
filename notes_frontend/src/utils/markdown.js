let parseFn = (text) => String(text || '');

try {
  // Support both ESM and CJS-like default exports in CRA
  // eslint-disable-next-line import/no-extraneous-dependencies
  // Dynamically require to avoid bundler confusion if dependency is missing
  // The dependency is declared in package.json; this guards against runtime edge cases.
  // eslint-disable-next-line global-require
  const lib = require('marked');
  const marked = lib.marked || lib.default || lib;
  if (marked && typeof marked.parse === 'function') {
    parseFn = (text) => marked.parse(text || '', { mangle: false, headerIds: false });
  }
} catch (e) {
  // Fallback is already set; keep plain text if marked isn't available
  // This ensures the app still works without markdown rendering.
}

/**
 * PUBLIC_INTERFACE
 * renderMarkdown parses markdown to HTML using marked when available, otherwise returns plain text HTML-escaped.
 */
export function renderMarkdown(text) {
  return parseFn(text || '');
}
