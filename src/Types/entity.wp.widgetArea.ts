/**
 * @param skipIfExists it's a boolean value that prevent to throw an error if the given element already exists ( when someone tries to re-create it)
 */
export type widgetAreaParams = {
  widgetAreaName: string;
  skipIfExists?: boolean;
};
