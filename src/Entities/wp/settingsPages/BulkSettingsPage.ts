
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { SettingsPage } from "./SettingsPage"

class BulkSettingsPage {
  
  public readonly ERR_EMPTY_QUEUE = "ERROR: There the queue is empty";
  public QUEUE: SettingsPage[] = [];

  /**
   * @description intialize the class
   * @param themePath the theme absolute path
   * @param assetsPath the relative path to the theme's assets folder
   */
  constructor(public themeAux: ThemeAux) {}
  /**
   * @description add the given pages to the queue of creation/importation
   * @param pages a list of the pages to add
   */
  public add(...pages: SettingsPage[]) {
    for (let page of pages) {
      this.QUEUE.push(page);
    }
  }

  /**
   * @description import all the pages in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the create pages from the this.QUEUE array
   */
  public importAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.ERR_EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let settings_page = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      settings_page.import();
    }
  }
  /**
   * @description create all the pages in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the create pages from the this.QUEUE array
   */
  public createAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.ERR_EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let settings_page = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      settings_page.create();
    }
  }
}

export { BulkSettingsPage };
