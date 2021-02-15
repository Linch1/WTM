import { extensions } from "../Enums/common.extension";

/**
 * @description check if a passed string is a valid supported extension
 * @param extension the extension to check
 */
export function checkValidExtension(
  extension: string | extensions | undefined
): boolean {
  if (extension && extension in extensions) return true;
  return false;
}
