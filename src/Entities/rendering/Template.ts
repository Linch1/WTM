import { Project } from "../../ManageProjects";
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { View } from "../../ManageView";

export class Template extends View {
  constructor( nullOne: ThemeAux, nullTwo: string ){
    super('null', new Project(''));
  }
  getIncludeFunction(path: string): string {
    throw new Error("Method not implemented.");
  }
}