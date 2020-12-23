
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { PostType } from "./PostType";

class BulkPostType {
  
  public readonly EMPTY_QUEUE = "ERROR: There the queue is empty";
  public QUEUE: PostType[] = [];

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description import all the post types in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the create post types from the this.QUEUE array
   */
  public importAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let post_type = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      post_type.import();
    }
  }
  /**
   * @description add the given post type to the queue of creation/importation
   * @param postTypes a list of the post types to add
   */
  public add(...postTypes: PostType[]) {
    for (let postType of postTypes) {
      this.QUEUE.push(postType);
    }
  }
  /**
   * @description create all the post types in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the created post types from the this.PAGES array
   */
  public createAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let post_type = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      post_type.create();
    }
  }
}

export { BulkPostType };
