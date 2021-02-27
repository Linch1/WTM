
import { Visual } from "../ManageVisual/Visual";
import { ProjectJsonInformationsLibElem } from "../Types";
import { DependenciesManager } from "./DependenciesManager";

export class VisualsDependenciesManager extends DependenciesManager {
    constructor( public CLIENT: Visual ){
        super(CLIENT);
    }
    public copyLibDependencies( libName: string, libDep: ProjectJsonInformationsLibElem ){
        if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
        this.JSON.lib[libName] = libDep;
        this.CLIENT.saveJson();
    }
}