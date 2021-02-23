export type folderObject = {
    level: number;
    folderPath: string;
    folders: folderObject[];
    files: string[];
};