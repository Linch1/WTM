type nestedStringsArrays = string | string[] | nestedStringsArrays[];
type readFileContent = {
    functionsArray: string[],
    functionIndex: number,
    targetFunctionOpenSplit: string[],
    targetFunctionCloseSplit: string[],
    functionBody: string
}

export { 
    nestedStringsArrays,
    readFileContent
};