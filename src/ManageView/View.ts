import { FileReader } from "../ManageFiles/FileReader";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { extensions,  identifierActions,  identifierType,  IncludeFunctions,  ProjectTypes } from "../Enums";
import { FileWriter } from "../ManageFiles/FileWriter";
import { viewJson } from "../Types/entity.rendering.jsons";
import { replaceAllParams } from "../Types/files.StringComposerWriter";
import { addBlockParams } from "../Types/entity.rendering.params.addBlock";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";
import { IdentifierPlaceholder, Identifiers } from "../Identifiers";
import { ConstViews } from "../Constants/const.views";
import { Project } from "../ManageProjects/Project";
import { Visual } from "../ManageVisual";
import { StringComposeReader } from "../ManageFiles";
import { ViewReader } from "./ViewReader";
import { ViewWriter } from "./ViewWriter";
import { ViewRender } from "./ViewRender";
import { Checker } from "../Checkers/Checker";
import { ViewIntializer } from "./ViewInitializer";

export class View {
  public readonly ERR_NOT_VALID_HTML_BLOCK = "ERR: The passed Html block identified by the passed parentBlockName doesn't exists in the (template/single) file";
  public readonly ERR_VIEW_NOT_CREATED = "ERR: Before calling this method create the view with the .create() method";
  public readonly ERR_VIEW_ALREADY_EXISTS = "ERR: The view already exists";
  public readonly ERR_VISUAL_NO_EXISTS = "The passed visual doesn't exists";
  public readonly ERR_TYPE_NOT_FOUND = "The passed type is not yet implemented to output a valid path";
  public readonly ERR_NO_AVIABLE_VISUAL_TO_INCLUDE = "The visual is not created for the given project type and also the html type ( used as fallback ) is not present";

  public readonly IDENTIFIER_PLACEHOLDER_PAGE_NAME: string = ConstViews.IdentifierPageName;
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_START: string = ConstViews.IdentifierPageStart;
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_END: string = ConstViews.IdentifierPageEnd;

  public readonly IDENTIFIER_PLACEHOLDER_DEFAULT_SCRIPTS: string = ConstViews.IdentifierDefaultScripts;
  public readonly IDENTIFIER_PLACEHOLDER_DEFAULT_STYLES: string = ConstViews.IdentifierDefaultStyles;

  public PAGE_PROJECT_TYPE: ProjectTypes;
  public VIEWS_FOLDER: string = "";
  public PAGE_PREFIX: string = "";
  public JSON_FOLDER_PATH: string = "";
  public JSON_FILE_PATH: string = "";
  public JSON_COMMON_INFORMATIONS_FILE_PATH: string = "";
  public COMMON_DEFAULT_BUILD_FILE_PATH: string = "";

  public JSON_FILE_CONTENT: viewJson = ConstViews.getViewsJsonContent();
  public JSON_COMMON_INFORMATIONS = ConstViews.getViewsCommonJsonContent( );
  public COMMON_DEFAULT_BUILD = ConstViews.CommonContent; // modified in wp themes and singles

  public reader: ViewReader;
  public writer: ViewWriter;
  public render: ViewRender;
  public initializer: ViewIntializer;

  constructor( public VIEW_NAME: string, public PROJECT: Project ) {

    /*
    set the main objects to manage views
    */
    this.reader = new ViewReader(this);
    this.writer = new ViewWriter(this);
    this.render = new ViewRender(this);
    this.initializer = new ViewIntializer(this);

    this.PAGE_PREFIX = ConstViews.Prefix;
    this.JSON_FILE_CONTENT.name = VIEW_NAME;
    this.PAGE_PROJECT_TYPE = this.PROJECT.reader.getProjectType();
    this.JSON_FILE_CONTENT.projectType = this.PAGE_PROJECT_TYPE;
    
    /* 
     set the correct paths to files and directories of the view but
     withouth creating them, this are created once that the method
     -> this.intializer.create() 
     is called 
     */
    this.initializer.parseName();
    this.initializer.setViewsFolderPath();
    this.initializer.setJsonFolderPath();
    this.initializer.setJsonFilePath();
    this.initializer.setCommonDefaultBuildFilePath();
    this.initializer.setCommonInformationsFilePath();
    
    /* create the needed files and directories */
    this.initializer.create();
  }

  getIncludeFunction(path: string): string {
    return IncludeFunctions.include(path, this.reader.getProjectType());
  }

  

}
