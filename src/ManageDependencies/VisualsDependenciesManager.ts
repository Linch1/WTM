
import { Visual } from "../ManageVisual/Visual";
import { DependenciesManager } from "./DependenciesManager";

export class VisualsDependenciesManager extends DependenciesManager {
    constructor( public CLIENT: Visual ){
        super(CLIENT);
    }
}