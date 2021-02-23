import { identifierActions, ProjectTypes, renderTypes } from "../Enums";
import { identifiersAttributesType } from "./identifiers.attributes";

/* this keys are from the enum defined in ../Enums/manageVisual.visual.renderType.ts */
export type visualJsonIdentifiers = {
  [key in  keyof typeof renderTypes]: { [key in identifierActions] : { [key: string]: identifiersAttributesType } }
};

export type visualJsonLib = {
  scripts: string[],
  styles: string[],
  cdn: string[],
  url: string;
}

export type visualJson = {
  visual: {
    name: string;
    projectType: ProjectTypes;
    assetsAutoImport: boolean; // allow the automatical import of js/css files of the visual
    author: string;
    autorhUrl: string;
    githubRepo: string;
  };
  identifiers: visualJsonIdentifiers;
  dependencies: {
    scripts: string[];
    styles: string[];
  },
  lib: {
    [key: string] : visualJsonLib
  },
  connected: {
    -readonly [ projectType in  keyof typeof ProjectTypes]?: {
      [visualName: string]: {
        path: string
      };
    }
  }
};


