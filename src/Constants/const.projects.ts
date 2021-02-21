import { ProjectJsonInformationsVisualsLibElem } from "../Types/manageProject.jsonInformations";
import { ConstVisuals } from "./const.visuals";

/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstProjects {
  static jsonPathInProjectDirectory = "WTM-PROJECT";
  static jsonProjectsDirectory = "Projects";
  static jsonProjectsFile = "projects.json";
  static jsonProjectFile = "project-info.json";
  static getVisualsLibElemContent(): ProjectJsonInformationsVisualsLibElem {
    return {
        visuals: [], // the names of the visuals that depends on this lib
        scripts: [], // the lib scripts
        styles: [] // the lib styles
    }
  }
}
