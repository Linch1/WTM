import { FileReader } from "../ManageFiles";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { Project } from "../ManageProjects";
import { Visual } from "../ManageVisual/Visual";
import { ProjectJsonInformations, ProjectJsonInformationsLibElem } from "../Types/manageProject.jsonInformations";
import { visualJson } from "../Types/manageVisual.jsons";
import { DependenciesManagerReader } from "./DependenciesManagerReader";
import { DependenciesManagerWriter } from "./DependenciesManagerWriter";

export class DependenciesManager {
  public JSON: ProjectJsonInformations | visualJson;
  public readonly NO_LIB_FOUND = "The given lib doesn't exists";
  public readonly NO_ASSETS_LIB_PATH = "The given ASSETS_LIB_PATH is undefined or empty "
  public readonly ERR_EMPTY_PROJECT_PATH = "The path to the project of the current visual is empty on undefined";

  public reader: DependenciesManagerReader;
  public writer: DependenciesManagerWriter;

  constructor(public CLIENT: Visual | Project) {
    this.JSON = CLIENT.reader.getJson();
    this.reader = new DependenciesManagerReader(this);
    this.writer = new DependenciesManagerWriter(this);
  }
}
