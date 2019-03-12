// tslint:disable: newline-before-return
// tslint:disable-next-line: max-line-length
import { createCall, createExpressionStatement, createIdentifier, createPrinter, createSourceFile, createToken, EmitHint, Identifier, NewLineKind, Node, ScriptKind, ScriptTarget, SyntaxKind, Token, TypeNode } from 'typescript';
import { NodeBuilder } from './NodeBuilder';
import { NodePrinter } from './NodePrinter';

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

  export function getMethodCall(methodName: string, objectName: string, argNames?: string[], typeParameter?: TypeNode[]): Node {
    const params = argNames === undefined ? undefined : argNames.map(x => createIdentifier(x));
    const methodIdentifier = createIdentifier(methodName);
    const call = createCall(methodIdentifier, typeParameter, params);

    const callExpression = createExpressionStatement(call);
    if (objectName === undefined) {
      return callExpression;
    } else {
      return createIdentifier(`${objectName}.${NodePrinter.printNode(callExpression)}`);
    }

  }

  export function getStatement(line: string): Identifier {
    return createIdentifier(line);
  }

}
