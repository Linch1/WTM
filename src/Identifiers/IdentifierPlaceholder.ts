import { identifierType } from "../Enums/identifiers.type";
import { GeneralIdentifier } from "./GeneralIdentfier";

export class IdentifierPlaceholder extends GeneralIdentifier{
    static IDENTIFIER_TYPE: identifierType = identifierType.PLACEHOLDER;
}

