/**
 * @param skipIfExists it's a boolean value that prevent to throw an error if the given element already exists ( when someone tries to re-create it) 
 */
type settingsPageParams = {
  pageName: string;
  pageDisplayedName: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean; 
};
export {settingsPageParams}