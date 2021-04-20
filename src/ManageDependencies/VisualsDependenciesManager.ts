
import { Visual } from "../ManageVisual/Visual";
import { ProjectJsonInformationsLibElem } from "../Types";
import { DependenciesManager } from "./DependenciesManager";

export class VisualsDependenciesManager extends DependenciesManager {
    constructor( public CLIENT: Visual ){
        super(CLIENT);
    }
    /**
     * @description copty in the passed lib the given informations
     * - this method override the old lib informations
     * @param libName the name of the lib where to add the dependencies
     * @param libDep the dependencies to add
     */
    public copyLibDependencies( libName: string, libDep: ProjectJsonInformationsLibElem ){
        this.JSON.lib[libName] = libDep;
        this.CLIENT.writer.saveJson();
    }
}