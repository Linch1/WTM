import { extensions, identifierActions, renderTypes } from "../Enums";
import { identifiersAttributesType } from "./identifiers.attributes";

/* this keys are from the enum defined in ../Enums/manageVisual.visual.renderType.ts */
export type visualJsonIdentifiers = {
  [key in  keyof typeof renderTypes]: { [key in identifierActions] : { [key: string]: identifiersAttributesType } }
};

export type visualJson = {
  visual: {
    name: string;
    extension: extensions;
  };
  identifiers: visualJsonIdentifiers;
  dependencies: {
    scripts: string[];
    styles: string[];
  }
};


