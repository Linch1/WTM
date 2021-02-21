import { identifierActions, ProjectTypes, renderTypes } from "../Enums";
import { identifiersAttributesType } from "./identifiers.attributes";

/* this keys are from the enum defined in ../Enums/manageVisual.visual.renderType.ts */
export type visualJsonIdentifiers = {
  [key in  keyof typeof renderTypes]: { [key in identifierActions] : { [key: string]: identifiersAttributesType } }
};

export type visualJson = {
  visual: {
    name: string;
    projectType: ProjectTypes;
  };
  identifiers: visualJsonIdentifiers;
  dependencies: {
    scripts: string[];
    styles: string[];
  },
  lib: {
    [key: string] : {
      scripts: string[],
      styles: string[]
    }
  },
  connected: {
    -readonly [ projectType in  keyof typeof ProjectTypes]?: {
      [visualName: string]: {
        path: string
      };
    }
  }
};


