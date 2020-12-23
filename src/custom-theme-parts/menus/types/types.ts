/**
 * @param skipIfExists it's a boolean value that prevent to throw an error if the given element already exists ( when someone tries to re-create it) 
 */
type menuMainPageParams = {
  menuName: string;
  menuDisplayedName: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean; 
};
/**
 * @param skipIfExists it's a boolean value that prevent to throw an error if the given element already exists ( when someone tries to re-create it) 
 */
type menuSubPageParams = {
  pageName: string;
  pageNameDisplayed: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean;
};
export { menuMainPageParams, menuSubPageParams };
