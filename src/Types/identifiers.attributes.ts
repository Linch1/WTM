import { identifiersAttributes } from '../Enums/identifiers.attributes';
export type identifiersAttributesType = {
    -readonly [ key in keyof typeof identifiersAttributes]?: string;
};
