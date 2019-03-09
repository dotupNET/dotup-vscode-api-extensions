// import { createIdentifier, LiteralLikeNode, Node } from 'typescript';

// export namespace NodeGenerator {

//   export function getComment(text: string): Node {
//     return <LiteralLikeNode>createIdentifier(`// ${text}`);
//   }

//   // export function getMultiLineComment(text: string): Node {
//   //   return <LiteralLikeNode>createIdentifier(`/* ${text}`);
//   // }

//   export function getMultiLineComment(...text: string[]): Node[] {
//     const result: Node[] = [];
//     result.push(createIdentifier('/*'));
//     text.forEach(line => {
//       result.push(createIdentifier(` * ${line}`));
//     });
//     result.push(createIdentifier('*/'));

//     return result;
//   }
// }
