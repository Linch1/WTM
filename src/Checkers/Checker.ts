import { ProjectTypes, extensions, MapProjectTypeToExtension } from "..";

export class Checker {
  static ERR_INVALID_PROJECT_TYPE =
    "The passed project type is not a valid one";
  /**
   * This is not properly a decorator but is instead a 'checker' function
   * @description reutrns the extension based a given project type
   */
  static checkMapProjectTypeToExtension(type: ProjectTypes): extensions {
    if (type in MapProjectTypeToExtension) {
      return (MapProjectTypeToExtension[type] as unknown) as extensions;
    } else throw new Error(" ERR NOT A VALID MAPPED PROJECT TYPE ");
  }

  /**
   * @description check if a passed string is a valid supported extension
   * @param extension the extension to check
   */
  static checkValidExtension(
    extension: string | extensions | undefined
  ): boolean {
    if (extension && extension in extensions) return true;
    return false;
  }

  /**
   * @description check if a passed string is a valid supported project type, if not it returns false
   * @param projectType the extension to check
   */
  static checkValidProjectType(
    ptojectType: string | ProjectTypes | undefined
  ): boolean {
    if (ptojectType && ptojectType in ProjectTypes) return true;
    return false;
  }

  /**
   * @description check if a passed string is a valid supported project type, if not it throws an error
   * @param projectType the extension to check
   */
  static checkValidProjectTypeWithError(
    ptojectType: string | ProjectTypes | undefined
  ): boolean {
    if (ptojectType && ptojectType in ProjectTypes) return true;
    throw new Error(Checker.ERR_INVALID_PROJECT_TYPE);
  }
}
