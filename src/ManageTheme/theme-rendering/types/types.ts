type defaultJson = {
  post: {
    header: string;
    footer: string;
  };
  page: {
    header: string;
    footer: string;
  };
};

/**
 * @param include an array that contains the included paths
 * @param name the name of the single/template
 * @param blocks an object that contains informations about the existing blocks 
 * - `{ BLOCK_NAME : { open: "<div .. my open tag >", close: "<div ..the close tag >"}}`
 * - Ex: `{ "BODY" { open: "", close: "" }}`
 */
type informationsJson = {
  include: string[];
  blocks: {
    [key: string]: { open: string; close: string };
  };
  name: string;
};
export { defaultJson, informationsJson };
