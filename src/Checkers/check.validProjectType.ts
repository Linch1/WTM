import { ProjectTypes } from "../Enums";

/**
 * @description check if a passed string is a valid supported project type
 * @param projectType the extension to check
 */
export function checkValidProjectType(
  ptojectType: string | ProjectTypes | undefined
): boolean {
  if (ptojectType && ptojectType in ProjectTypes) return true;
  return false;
}
