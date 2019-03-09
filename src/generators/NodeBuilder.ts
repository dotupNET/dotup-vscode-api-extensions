// tslint:disable: newline-before-return
// tslint:disable-next-line: max-line-length
import { createIdentifier, createPrinter, createSourceFile, createToken, EmitHint, NewLineKind, Node, Printer, ScriptKind, ScriptTarget, SourceFile, SyntaxKind, createCall, TypeNode, createStringLiteral, createLiteral, createExpressionStatement, createCallSignature, ListFormat, createNodeArray } from 'typescript';
import { ValueProvider } from '../providers/ValueProvider';

export class NodeBuilder {

  nodes: Node[];
  printer: Printer;
  tempFile: SourceFile;
  readonly valueProvider: ValueProvider;

  constructor(valueProvider?: ValueProvider) {
    this.nodes = [];
    this.valueProvider = valueProvider || new ValueProvider();
  }

  add(node: Node | Node[]): this {
    if (Array.isArray(node)) {
      node.forEach(item => {
        this.nodes.push(item);
      });
    } else {
      this.nodes.push(node);
    }
    return this;
  }

  addNewLine(): this {
    return this.add(createToken(SyntaxKind.NewLineTrivia));
  }

  getNewLine(): Node {
    return createToken(SyntaxKind.NewLineTrivia);
  }

  addComment(text: string): this {
    this.add(createIdentifier(`// ${text}`));
    return this.addNewLine();
  }

  addMultiLineComment(...text: string[]): this {
    return this
      .add(createIdentifier('/*'))
      .add(text.map(line => createIdentifier(` * ${line}`)))
      .add(createIdentifier('*/'))
      ;
  }

  join(nodes: Node[], separator: Node | (() => Node)): Node[] {
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

  addMethodCall(methodName: string, objectName: string, argNames?: string[], typeParameter?: TypeNode[]): this {
    const params = argNames === undefined ? undefined : argNames.map(x => createIdentifier(x));
    const methodIdentifier = createIdentifier(methodName);
    const call = createCall(methodIdentifier, typeParameter, params);

    const callExpression = createExpressionStatement(call);
    if (objectName === undefined) {
      return this.add(callExpression);
    } else {
      const callNode = createIdentifier(`${objectName}.${this.printNode(callExpression)}`);
      return this.add(callNode);
    }
  }

  // addSemicolon(): this {
  //   return this.add(createLiteral(';'));
  // }

  private initializePrinter(): void {
    this.tempFile = createSourceFile(
      'tmp.ts',
      '',
      ScriptTarget.Latest,
      false,
      ScriptKind.TS
    );

    this.printer = createPrinter(
      {
        newLine: NewLineKind.CarriageReturnLineFeed
      }
    );
  }

  printNode(node: Node | Node[]): string {
    if (this.printer === undefined) {
      this.initializePrinter();
    }

    if (Array.isArray(node)) {
      const result: string[] = [];
      node.forEach(item => {
        result.push(this.printer.printNode(EmitHint.Unspecified, item, this.tempFile));
      });
      // return this.printer.printList(ListFormat.SourceFileStatements, createNodeArray(node), this.tempFile);
      return result.join('\n');
    } else {
      return this.printer.printNode(EmitHint.Unspecified, node, this.tempFile);
    }
  }

  print(): string {
    return this.printNode(this.nodes);
  }

}
