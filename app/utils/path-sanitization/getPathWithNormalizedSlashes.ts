export function getPathWithNormalizedSlashes(str: string) {
  let normalizedPath = str;
  if (normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.substring(0, normalizedPath.length - 1);
  }
  return normalizedPath;
}
function addPluses(str: string) {
  let normalizedPath = str;
  if (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.substring(1);
  }
  normalizedPath = normalizedPath.replaceAll("/", "+/");
  if (normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.substring(0, normalizedPath.length - 2);
  }
  return normalizedPath;
}
