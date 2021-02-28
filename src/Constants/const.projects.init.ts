
import { ProjectTypes } from "../Enums";
import { ProjectJsonInformationsLibElem } from "../Types/manageProject.jsonInformations";
import { ConstVisuals } from "./const.visuals";

/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstProjectsInit {
  
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
  static IncludeScriptForHtmlProject = `
<script>
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.querySelectorAll("[include-html]");
  console.log( z )
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    let currentMainFolder = Object.assign(document.createElement('a'), {href: '../'}).pathname;
    file = elmnt.getAttribute("include-html").startsWith('/') ? \`\${currentMainFolder}\${elmnt.getAttribute("include-html")} \`: \`\${currentMainFolder}/\${elmnt.getAttribute("include-html")}\`
    console.log( file )
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        console.log( this.responseText, this.readyState )
        if (this.readyState == 4) {
          if (this.status == 200 || this.status == 0) {
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
  console.log( 'loaded' )
    includeHTML();
}
</script>
`


}
