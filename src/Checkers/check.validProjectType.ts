import { ProjectTypes } from "../Enums";

const ERR_INVALID_PROJECT_TYPE = 'The passed project type is not a valid one';

/**
 * @description check if a passed string is a valid supported project type, if not it returns false
 * @param projectType the extension to check
 */
export function checkValidProjectType(
  ptojectType: string | ProjectTypes | undefined
): boolean {
  if (ptojectType && ptojectType in ProjectTypes) return true;
  return false;
}

/**
 * @description check if a passed string is a valid supported project type, if not it throws an error
 * @param projectType the extension to check
 */
export function checkValidProjectTypeWithError(
  ptojectType: string | ProjectTypes | undefined
): boolean {
  if (ptojectType && ptojectType in ProjectTypes) return true;
  throw new Error(ERR_INVALID_PROJECT_TYPE);
}
