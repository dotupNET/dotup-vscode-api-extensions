// tslint:disable-next-line: max-line-length
import { createCall, createExpressionStatement, createIdentifier, createToken, Identifier, Node, SyntaxKind, Token, TypeNode, PropertyAssignment, createPropertyAssignment, createPropertyAccess, createAssignment } from 'typescript';
import { NodePrinter } from './NodePrinter';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

export namespace NodeGenerator {

  export function getNewLine(): Token<SyntaxKind.NewLineTrivia> {
    return createToken(SyntaxKind.NewLineTrivia);
  }

  export function getComment(text: string): Identifier {
    return createIdentifier(`// ${text}`);
  }

  export function getMultiLineComment(...text: string[]): Identifier[] {
    return [
      createIdentifier('/*'),
      ...text.map(line => createIdentifier(` * ${line}`)),
      createIdentifier('*/')
    ];
  }

  export function join(nodes: Node[], separator: Node | (() => Node)): Node[] {
    const result: Node[] = [];
    for (let index = 0; index < nodes.length; index += 1) {
      result.push(nodes[index]);
      if (index < (nodes.length - 1)) {
        if (typeof separator === 'function') {
          result.push(separator());
        } else {
          result.push(separator);
        }
      }
    }

    return result;
  }

  // tslint:disable-next-line: max-line-length
  export function getPropertySet(propertyName: string, objectName: string, value: string): Node {

    const propertyAccess = createPropertyAccess(
      createIdentifier(objectName),
      propertyName
    );

    const xy = NodePrinter.printNode(propertyAccess);
    const propertyAssignment = createAssignment(propertyAccess, createIdentifier(value));
    const assignment = NodePrinter.printNode(propertyAssignment);

    return propertyAssignment;
    // return createIdentifier(`const result = ${objectName}.${xy}`);
  }

  export function getPropertyGet(propertyName: string, objectName: string, value: string): Node {

    const propertyAccess = createPropertyAccess(
      createIdentifier(objectName),
      propertyName
    );

    const getValue = NodePrinter.printNode(propertyAccess);

    return createIdentifier(`const result = ${getValue};`);
  }

  // tslint:disable-next-line: max-line-length
  export function getMethodCall(methodName: string, objectName: string, argNames?: string[], typeParameter?: TypeNode[], withResult: boolean = false): Node {
    const params = argNames === undefined ? undefined : argNames.map(x => createIdentifier(x));
    const methodIdentifier = createIdentifier(methodName);
    const call = createCall(methodIdentifier, typeParameter, params);

    const callExpression = createExpressionStatement(call);
    if (objectName === undefined) {
      if (withResult) {
        return createIdentifier(`const result = ${NodePrinter.printNode(callExpression)};`);
      } else {
        return callExpression;
      }
    } else {
      if (withResult) {
        return createIdentifier(`const result = ${objectName}.${NodePrinter.printNode(callExpression)};`);
      } else {
        return createIdentifier(`${objectName}.${NodePrinter.printNode(callExpression)};`);
      }
    }
  }

  export function getStatement(line: string): Identifier {
    return createIdentifier(line);
  }

}
