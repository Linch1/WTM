
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { WidgetArea } from "./WidgetArea"

class BulkWidgetArea{

  public readonly EMPTY_QUEUE = "ERROR: There the queue is empty";
  public QUEUE: WidgetArea[] = [];

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description import all the widget areas in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the create post types from the this.QUEUE array
   */
  public importAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let widget_area = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      widget_area.import();
    }
  }

  /**
   * @description add the given widget areas to the queue of creation/importation
   * @param widgetAreas a list of the widget areas to add
   */
  public add(...widgetAreas: WidgetArea[]) {
    for (let widgetArea of widgetAreas) {
      this.QUEUE.push(widgetArea);
    }
  }

  /**
   * @description create all the widget areas in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the created post types from the this.PAGES array
   */
  public createAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let widget_area = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      widget_area.create();
    }
  }
}

export { BulkWidgetArea };
