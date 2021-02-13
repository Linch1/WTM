import { extensions } from "./extension";

export class IncludeFunctions{

    static functions = {
        ejs: ( path: string, initIncludePathWithMainFolderPath: boolean = true): string => {
            if( !initIncludePathWithMainFolderPath ) return `<%-include ("${path}", {TEMPLATE_PATH: process.env.PWD})-%>\n`;
            else return `<%-include (TEMPLATE_PATH +"${path}", {TEMPLATE_PATH: process.env.PWD})-%>\n`;
        },
        php: ( path: string, initIncludePathWithMainFolderPath: boolean = true): string => {
            if( !initIncludePathWithMainFolderPath ) return `<?php include('${path}');?>\n`
            else return `<?php include(TEMPLATEPATH.'${path}');?>\n`;
        }
    }

    /**
     * @description based on the passed extension it returns an include statement. Ex: 
     * - php:  *< ?php include(TEMPLATEPATH.'${path}');?>*
     * - ejs:  *<%-include (TEMPLATE_PATH +"${path}", {TEMPLATE_PATH: process.env.PWD})-%>*
     * @param path tha path to include
     * @param extension the extension 
     * @param initIncludePathWithMainFolderPath if the included path has to start with the main template/project forlder _default: **true**_
     */
    static include(path: string, extension: extensions, initIncludePathWithMainFolderPath: boolean = true){
        return IncludeFunctions.functions[extension](path, initIncludePathWithMainFolderPath);
    }
}