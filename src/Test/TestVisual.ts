
import { StringComposeWriter } from "../files/StringComposeWriter";

import { VisualAux } from "../ManageVisual/VisualAux";
import { VisualWriter } from "../ManageVisual/VisualWriter";
import { VisualReader } from "../ManageVisual/VisualReader";
import { VisualConverter } from "../ManageVisual/VisualConverter";
import { renderTypes } from "../Enums/manageVisual.visual.type";



let testVisual = "/home/pero/projects/WPThemeManager/visual/testVisual";
let visualIntializer: VisualAux = new VisualAux(testVisual);
let visualWr: VisualWriter = visualIntializer.writer;
let visualRd: VisualReader = visualIntializer.reader;
let visualCv: VisualConverter= visualIntializer.converter;

let StrCompW = StringComposeWriter;

/**
 * @description class to perform tests on the lib
 */
class TestVisual {
  constructor() {}

  static log(phrase: string){
      console.log(`[ WTM-TEST ] : ${phrase}`);
  }

  static VisualCreate(){
    visualWr.createVisual();
    this.log("Created the visual");
  }
  static VisualEditHtml(){
    let html: string = 
`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>

<body>
    <p>[WTM-HTML-ciaone]</p>
    <p>[WTM-HTML-COME-VA]</p>
</body>

</html>`; 
    visualWr.setHtml(html);
    this.log("Edited visual dfault.php HTML");
  }
  static visualRenderDefault(){
    visualCv.renderType(renderTypes.HTML);
    this.log("Rendering HTML identifiers values")
  }
  static visualRenderAcf(){
    visualCv.renderType(renderTypes.ACF);
    this.log("Rendering ACF identifiers values")
  }
  static visualPopulateIdentfiers(){
    visualWr.populateIdentifiers();
    visualWr.populateIdentifiersAcf();
    this.log("Populated found identifiers")
  }


}

export { TestVisual };
