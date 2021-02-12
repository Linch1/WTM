import { extensions } from "./extension";

export class IncludeFunctions{

    static functions = {
        ejs: ( path: string): string => {
            return `<%-include (TEMPLATE_PATH +"${path}", {TEMPLATE_PATH: process.env.PWD})-%>\n`
        },
        php: ( path: string): string => {
            return `<?php include(TEMPLATEPATH.'${path}');?>\n`
        }
    }

    static include(path: string, extension: extensions){
        return IncludeFunctions.functions[extension](path);
    }
}