/**
 * @description validate if
 * - the _name_ param is valid
 * - the _this.IDENTIFIER_TYPE_ is correctly initialized
 * @param target 
 * @param methodName 
 * @param descriptor 
 */
export function ValidateIdentifierMethods(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalFn = target[methodName];
  descriptor.value = function (name: string, addInitialSlash?: boolean) {
    //@ts-ignore
    if (!this.IDENTIFIER_TYPE)
      //@ts-ignore
      throw new Error(this.ERR_INVALID_IDENTIFIER_TYPE);
    //@ts-ignore
    if (!name) throw new Error(this.ERR_INVALID_NAME);
    return originalFn.call(this, name, addInitialSlash);
  };
}
