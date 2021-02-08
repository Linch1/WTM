import { identifierActions, renderTypes } from "../Enums";

/* this keys are from the enum defined in ../Enums/manageVisual.visual.renderType.ts */
export type visualJsonIdentifiers = {
  [key in  keyof typeof renderTypes]: { [key in identifierActions] : { [key: string]: string } }
};

export type visualJson = {
  visual: {
    name: string;
    extension: string;
  };
  identifiers: visualJsonIdentifiers;
};


