import {View} from "../Entities/rendering/View";
import { ProjectTypes } from "../Enums";
import { Project } from "../ManageProjects";

let view = new View( "home", new Project( "/home/pero/projects/WTM/LIB" ));
/**
 * @description class to perform tests on the lib
 */
class TestCustomRender {
  constructor() {}

  static createView() {
    view.create();
  }
  static addBlockInTemplate() {
    view.addBlock({
      parentBlockName: "BODY",
        blockName: "PRIMO-DIV",
        open: "<div id='ciao-PRIMO' class='come' >",
        close: "</div>",
      });
      view.addBlock({
        parentBlockName: "PRIMO-DIV",
        blockName: "SECONDO-DIV",
        open: "<div id='ciao-SECONDO' class='come' >",
        close: "</div>",
      });
   
  }
  static includeFileInTemplate() {
    //view.includeRelative("BODY", "/partials/BODY"); ignored
    //view.includeRelative("PRIMO-DIV", "/partials/PRIMO-DIV"); ignored
  }

  static delete() {
    view.delete();
  }


}

export { TestCustomRender };
