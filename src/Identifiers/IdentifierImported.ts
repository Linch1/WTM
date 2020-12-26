import { identifierType } from "../Enums/identifiers.type";
import { GeneralIdentifier } from "./GeneralIdentfier";

export class IdentifierImported extends GeneralIdentifier{
    static IDENTIFIER_TYPE: identifierType = identifierType.IMPORTED;
}

