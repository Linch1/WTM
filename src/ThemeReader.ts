import {
    nestedStringsArrays, 
    readFileContent
} from "./customTypes";
import {FileManager} from "./FileManager";
import {Theme} from "./Theme";
import {ThemeWriter} from "./ThemeWriter";

class ThemeReader extends Theme {

    public readonly NoFunctionFoundErr = "NO FUNCTION FOUND: no function was found with the given name";

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
    }

    public readFile(filePath: string): string {
        return FileManager.readFile(filePath);
    }

    public readFunctionBody(filePath: string, functionName: string): readFileContent {
        let fileText: string = FileManager.readFile(filePath);
        let functions: string[] = fileText.split("function"); // get all the texts between the function words
        let functionBody: string = "";
        for ( let i = 0; i < functions.length; i++ ){
            let func: string = functions[i].trim();
            if ( ! func.startsWith(functionName) ) continue; // check that is the correct function and if not skip
            let functionBodyOpenSplit: string[] = func.split("{");
            // the index 0 contains name_function(), the index 1 is the start of the function body
            let functionBodyCloseSplit: string[] = functionBodyOpenSplit[1].split("}"); 
            functionBody = functionBodyCloseSplit[0].trim(); // delimit the end of the function definition
            // return all this vars for let easier and faster the function changes in ThemeWriter
            return {
                functionsArray: functions,
                functionIndex: i,
                targetFunctionOpenSplit: functionBodyOpenSplit,
                targetFunctionCloseSplit: functionBodyCloseSplit,
                functionBody: functionBody
            };
        }
        throw new Error(this.NoFunctionFoundErr);
    }

}

export { ThemeReader };