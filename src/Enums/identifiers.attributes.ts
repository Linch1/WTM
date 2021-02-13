/**
 * @description represents all the valid attributed that can be passed to an identifier
 * - assuming that with the word _container_ it's indicated the _<div>_ or the _<html-tag>_ that is replaced instead
 * the identifier when the visual is rendered
 */
export enum identifiersAttributes {

    /**
     * @description if text is present the identifier is replaced directly with it's value 
     * so this attribute override the others and prevent the _container_ creation
     */
    text = 'text',

    /**
     * @description the path to the visual to include inside the _container_
     */
    visualTarget = 'visualTarget',

    /**
     * @description the css classes given to the _container_
     */
    parentClasses = 'parentClasses'
    
};
