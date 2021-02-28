
import { ProjectTypes } from "../Enums";
import { ProjectJsonInformationsLibElem } from "../Types/manageProject.jsonInformations";
import { ConstVisuals } from "./const.visuals";

/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstProjects {
  static jsonPathInProjectDirectory = "WTM-PROJECT";
  static jsonProjectsDirectory = "Projects";
  static jsonProjectsFile = "projects.json";
  static jsonProjectFile = "project-info.json";
  static projectAssetsDirectory = "assets"; // the 'assets' directory of each visual
  static projectAssetsCssDirectory = "css"; // the 'css' contains the shared styles between the visuals
  static projectAssetsJsDirectory = "js"; // the 'js' contains the shared scripts between the visuals
  static projectAssetsImgDirectory = "img"; // the 'img' 
  static projectAssetsLibDirectory = "lib"; // the 'lib'

  static IdentifierPlaceholderNamePathToProjectDir = "PJ-PATH" // the path ends without '/'. 
  static IdentifierPlaceholderNamePathToProjectAssets = "PJ-ASSETS" // the path ends without '/'. 
  static IdentifierPlaceholderNamePathToProjectAssetsImages = "PJ-ASSETS-IMAGES" // the path ends without '/'.
  static IdentifierPlaceholderNamePathToProjectAssetsJs = "PJ-ASSETS-JS" // the path ends without '/'. 
  static IdentifierPlaceholderNamePathToProjectAssetsCss = "PJ-ASSETS-CSS" // the path ends without '/'. 


  static getVisualsLibElemContent(): ProjectJsonInformationsLibElem {
    return {
        scripts: [], // the lib scripts
        styles: [], // the lib styles
        cdn: {
          scripts: [],
          styles: []
        },
        url: ""
    }
  }


  /**
   * DEFAULT VALUES FOR POPULATING A NEWLY CREATED PROJECT
   */

  static IdentifierScripts = "ADD-SCRIPTS";
  static IdentifierStyles = "ADD-STYLES";

  static htmlStart = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>`

  static htmlEnd = `
    </body>
    </html>`

  static htmlFooter = `<footer></footer>`;

  /**
   * @description script for allow the include in html 
   */
  static htmlProjectIncludeJs = `
<script>
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html").startsWith('/') ? \${process.env.PWD}\${elmnt.getAttribute("include-html")} : \${process.env.PWD}/\${elmnt.getAttribute("include-html")}
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

// execute the includes
window.addEventListener('load', start, false )
function start() {
    includeHTML();
}
</script>
`


}
