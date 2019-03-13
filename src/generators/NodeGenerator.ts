// tslint:disable-next-line: max-line-length : no-implicit-dependencies
import { createAssignment, createCall, createExpressionStatement, createIdentifier, createPropertyAccess, createToken, Identifier, Node, SyntaxKind, Token, TypeNode } from 'typescript';
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
    const expression = createExpressionStatement(propertyAssignment);
    const assignment = NodePrinter.printNode(expression);

    return expression;
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
  export function getMethodCall(methodName: string, objectName: string, isAsync: boolean, argNames?: string[], typeParameter?: TypeNode[], withResult: boolean = false): Node {

    // Create the call
    const methodArguments = argNames === undefined ? undefined : argNames.map(x => createIdentifier(x));
    const methodIdentifier = createIdentifier(methodName);
    const call = createCall(methodIdentifier, typeParameter, methodArguments);

    const awaitKeyword = isAsync ? 'await' : '';

    // Create the expression
    const callExpression = createExpressionStatement(call);
    if (objectName === undefined) {
      if (withResult) {
        return createIdentifier(`const result = ${awaitKeyword} ${NodePrinter.printNode(callExpression)}`);
      } else {
        return createIdentifier(`${awaitKeyword} ${NodePrinter.printNode(callExpression)}`);
      }
    } else {
      if (withResult) {
        return createIdentifier(`const result = ${awaitKeyword} ${objectName}.${NodePrinter.printNode(callExpression)}`);
      } else {
        return createIdentifier(`${awaitKeyword} ${objectName}.${NodePrinter.printNode(callExpression)}`);
      }
    }
  }

  export function getStatement(line: string): Identifier {
    return createIdentifier(line);
  }

}
