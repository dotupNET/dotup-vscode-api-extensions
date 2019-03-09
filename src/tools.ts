import { NodeArray, TypeParameterDeclaration, createTypeParameterDeclaration, ParameterDeclaration } from 'typescript';
export namespace tools {

  export function camelCase(value: string): string {
    return value.charAt(0).toLowerCase() + value.substr(1);
  }

  export function getCurrentIsoDate(): string {
    const dt = new Date(Date.now()).toISOString();

    // remove T and everything after dot
    return dt.replace(/T|\..+/g, ' ');
  }

  // export function join<T>(nodes: T[], separator: T | (() => T)): T[] {
  //   const result: T[] = [];
  //   for (let index = 0; index < nodes.length; index += 1) {
  //     result.push(nodes[index]);
  //     if (index < (nodes.length - 1)) {
  //       if (typeof separator === 'function') {
  //         result.push(separator());
  //       } else {
  //         result.push(separator);
  //       }
  //     }
  //   }
  //   return result;
  // }

}
