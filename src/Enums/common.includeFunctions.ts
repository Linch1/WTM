import { ProjectTypes } from "./common.projectTypes";

export class IncludeFunctions{

    static functions = {
        ejs: ( path: string, initIncludePathWithMainFolderPath: boolean = true): string => {
            if( !initIncludePathWithMainFolderPath ) return `<%-include ("${path}", {TEMPLATEPATH: process.env.PWD})-%>\n`;
            else return `<%-include (TEMPLATEPATH +"${path}", {TEMPLATEPATH: process.env.PWD})-%>\n`;
        },
        wordpress: ( path: string, initIncludePathWithMainFolderPath: boolean = true): string => {
            if( !initIncludePathWithMainFolderPath ) return `<?php include('${path}');?>\n`
            else return `<?php include(TEMPLATEPATH.'${path}');?>\n`;
        },
        html: ( path: string, initIncludePathWithMainFolderPath: boolean = true): string => {
            return `<div include-html='${path}'></div>`;
        },
    }

    /**
     * @description based on the passed extension it returns an include statement. Ex: 
     * - php:  *< ?php include(TEMPLATEPATH.'${path}');?>*
     * - ejs:  *<%-include (TEMPLATEPATH +"${path}", {TEMPLATEPATH: process.env.PWD})-%>*
     * @param path tha path to include
     * @param extension the extension 
     * @param initIncludePathWithMainFolderPath if the included path has to start with the main template/project forlder _default: **true**_
     */
    static include(path: string, projectType: ProjectTypes, initIncludePathWithMainFolderPath: boolean = true){
        return IncludeFunctions.functions[projectType](path, initIncludePathWithMainFolderPath);
    }
    /**
     * @description the variable name used to store the path to the project folder
     */
    static TEMPLATEPATH = 'TEMPLATEPATH'; 
}