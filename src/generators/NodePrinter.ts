// tslint:disable-next-line: no-implicit-dependencies
import { createPrinter, createSourceFile, EmitHint, NewLineKind, Node, Printer, ScriptKind, ScriptTarget, SourceFile } from 'typescript';
import { NodeBuilder } from './NodeBuilder';

export class NodePrinter {
  printer: Printer;
  tempFile: SourceFile;

  static printNode(node: Node | Node[] | NodeBuilder): string {
    let nodesToPrint: Node | Node[];
    if (node instanceof NodeBuilder) {
      nodesToPrint = node.nodes;
    } else {
      nodesToPrint = node;
    }

    const printer = new NodePrinter();

    return printer.printNode(nodesToPrint);
  }

  printNode(node: Node | Node[]): string {
    if (this.printer === undefined) {
      this.initializePrinter();
    }

    if (node === undefined) {
      return '';
    }

    if (Array.isArray(node)) {

      if (node.length < 1) {
        return '';
      }

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
  initializePrinter(): void {
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

}
