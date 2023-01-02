import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { Project } from "../../ManageProjects/Project";
import { View } from "../../ManageView";

export class Single extends View {
  constructor( nullOne: ThemeAux, nullTwo: string ){
    super('null', new Project(''));
  }
  getIncludeFunction(path: string): string {
    throw new Error("Method not implemented.");
  }
}