
import { ProjectTypes } from "../Enums/common.projectTypes";
import { visualJsonLib } from "./manageVisual.jsons";
export type ProjectJsonInformationsLibElem = visualJsonLib;
export type ProjectJsonInformations = {
    name: string;
    projectType: ProjectTypes;
    demoUrl: string;
    visualsPath: string;
    viewsPath: string;
    path: string;
    author: string;
    autorhUrl: string;
    githubRepo: string;
    assetsAutoImport: boolean; // allow the automatical import of js/css files of the project
    /**
     * @description custom scripts imported in the project
     */
    scripts: string[];
    /**
     * @description custom styles imported in the project
     */
    styles: string[];
    /**
     * @description this object contains the lib elements of all the visuals
     * - the elem name is the key of the sub-object
     */
    lib: {
        [key: string]: ProjectJsonInformationsLibElem
    }
     /**
     * @description this object contains the custom dependencies ( js/css ) of the individual visual
     * - the visual name is the key of the sub-object
     */
    visualsDependencies: {
        [key: string]: {
            scripts: string[];
            styles: string[];
        }
    },
};
  