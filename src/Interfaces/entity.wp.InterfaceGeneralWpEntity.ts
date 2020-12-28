export interface InterfaceWpEntity {
  /*
  -- RAISED ERRORS --

  public readonly ERR_NO_VALID_INFORMATIONS = "ERR: the informations attribute of this class are not correctly initalized";
  public readonly ERR_ALREADY_PRESENT = "ERR: The custom part area already exists";
  public readonly ERR_INVALID_TYPE = "ERR: The custom part has an invalid type"

  -- ENTITY PROPERTIES  -- [ initialized when the WpEntity is created ]

  public PATH: string = "";
  public DEFAULT_BUILD_PATH: string = "";
  protected FILE_NAME: string = "WTM-SETTINGS-PAGE.php";
  protected JSON_PATH: string = "";
  protected JSON_FILE_PATH: string = "";
  protected IDENTIFIER_NAME: string = "SETTINGS-PAGE";
  protected CUSTOM_PART_NAME: string = "";
  protected CUSTOM_PART_TYPE: customPartType = customPartType.NONE;
  
  */

  PARENT_DIR_PATH: string;
  DEFAULT_BUILD_PATH: string;

  initialize(): void;

  validInformations(): boolean;

  renderFileFunction(page: string): string;

  getDirectory(): string;

  createDirectory(): void;

  getInsideDirectory(file: string): string;

  getPath(): string;

  getPathJson(): string;

  createJsonDirectory(): void;

  saveJson(): void;

  import(): void;

  create(): void;
}
