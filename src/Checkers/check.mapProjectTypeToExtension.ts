import { extensions, MapProjectTypeToExtension, ProjectTypes } from "../Enums";

/**
 * This is not properly a decorator but is instead a 'checker' function
 * @description reutrns the extension based a given project type
 */
export function checkMapProjectTypeToExtension( type: ProjectTypes): extensions{
    if( type in MapProjectTypeToExtension ){ return MapProjectTypeToExtension[type] as unknown as extensions; }
    else throw new Error(" NOT A VALID MAPPED PROJECT TYPE ");
}