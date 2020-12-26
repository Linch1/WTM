import { identifierType } from "../Enums/identifiers.type";
import { GeneralIdentifier } from "./GeneralIdentfier";

export class IdentifierImport extends GeneralIdentifier{
    static IDENTIFIER_TYPE: identifierType = identifierType.IMPORT;
}

