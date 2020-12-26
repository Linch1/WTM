
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { Menu } from "./Menu";

class BulkMenu {
  
  public readonly EMPTY_QUEUE = "ERROR: There the queue is empty";
  public QUEUE: Menu[] = [];

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description import all the menu in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the creates menu from the this.QUEUE array
   */
  public importAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let menu = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      menu.importMainPage();
      menu.importSubPages();
    }
  }
  /**
   * @description add the given menu to the queue of creation/importation
   * @param menu a list of the menus to add
   */
  public add(...menus: Menu[]) {
    for (let menu of menus) {
      this.QUEUE.push(menu);
    }
  }
  /**
   * @description create all the menus in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the created menus from the this.PAGES array
   */
  public createAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let menu = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      menu.createMainPage();
      menu.createSubPages();
    }
  }
}

export { BulkMenu };
