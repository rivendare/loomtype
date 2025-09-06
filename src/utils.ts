// shared utility functions

// helper to write clean multi-line strings without indentation issues
export const dedent = (str: string): string => {
  const lines = str.split('\n');
  const minIndent = Math.min(
    ...lines.filter(l => l.trim()).map(l => l.match(/^(\s*)/)?.[0].length || 0)
  );
  return lines
    .map(l => l.slice(minIndent))
    .join('\n')
    .trim();
};
