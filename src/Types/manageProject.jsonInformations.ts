
import { ProjectTypes } from "../Enums/common.projectTypes";
export type ProjectJsonInformations = {
    name: string;
    projectType: ProjectTypes;
    visualsPath: string;
    viewsPath: string;
    path: string;
    scripts: string[];
    styles: string[];
    visualsDependencies: {
        [key: string]: {
            scripts: string[];
            styles: string[];
        }
    }
};
  