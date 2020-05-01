import { IExecutableSchemaDefinition } from 'apollo-server-express';
import { mergeWith } from 'lodash';

function customizer(objValue: any, srcValue: any) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export const mergeRawSchemas = (
  ...schemas: IExecutableSchemaDefinition[]
): IExecutableSchemaDefinition => {
  return mergeWith({}, ...schemas, customizer);
};
