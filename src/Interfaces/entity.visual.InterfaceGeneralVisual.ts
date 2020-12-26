import { pageTypes } from "../Enums/entities.visual.type";
import { defaultJson, informationsJson } from "../Types/entity.visual.jsons";

export interface InterfaceGeneralVisual {

    /*
    -- RAISED ERRORS --

    public readonly ERR_NOT_VALID_HTML_BLOCK = "ERR: The passed Html block identified by the passed identifier_name doesn't exists in the (template/single) file";

    -- ENTITY PROPERTIES  --

    public readonly IDENTIFIERS_HTML_BLOCKS: string[] = ["BODY"]; 
    public readonly IDENTIFIER_PLACEHOLDER_PAGE_NAME: string = "PAGE-NAME";
    public readonly IDENTIFIER_PLACEHOLDER_PAGE_TYPE: string = "PAGE-TYPE";
    public readonly IDENTIFIER_PLACEHOLDER_PAGE_HEADER: string = "PAGE-HEADER";
    public readonly IDENTIFIER_PLACEHOLDER_PAGE_FOOTER: string = "PAGE-FOOTER";
    
    */

  PAGE_NAME: string;
  PAGE_TYPE: pageTypes;
  PAGE_PREFIX: string;

  PATH: string;
  DEFAULT_BUILD_PATH: string;

  JSON_FOLDER_PATH: string;
  JSON_FILE_PATH: string;
  JSON_DEFAULT_DIR_PATH: string;
  JSON_DEFAULT_FILE_PATH: string;
  JSON_DEFAULT_INFORMATIONS: defaultJson;
  JSON_INFORMATIONS: informationsJson;

    

  initialize(): void;

  saveJson(): void;

  createJson(): void;

  getPath(): string;

  getFileName(): string;

  create(): void;

  includeRelative(identifier_name: string, path: string): void;

  addBlock(
    identifier_name: string,
    blockName: string,
    open: string,
    close: string
  ): void;
}
