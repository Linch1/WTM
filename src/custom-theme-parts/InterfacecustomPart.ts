interface InterfacecustomPart {
  PATH: string;
  DEFAULT_BUILD_PATH: string;

  /**
   * @description create the needed file/directories
   */
  initialize(): void;
  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  validInformations(): boolean;

  /**
   * @description get the path to the dircetory that contains the custom part
   */
  getDirectory(): string;
  /**
   * @description get the path to a file inside the custom part's directory
   * @param file the file for which retrive the path
   */
  getInsideDirectory(file: string): string;
  /**
   * @description returns the absolute path of the post type file
   */
  getPath(): string;
  /**
   * @description returns the absolute path of the json file that contains the relevant informations of the element
   */
  getJsonPath(): string;
  /**
   * @description save the informations of the element
   */
  saveJson(): void;
  /**
   * @description creates the element directory
   */
  createDirectory(): void;
  /**
   * @description import the current structure in the theme
   */
  import(): void;
  /**
   * @description create the file of the given custom part if not exists ( and populate it with the default params )
   */
  create(): void;
  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  renderFileFunction(page: string): string;
}

export { InterfacecustomPart };
