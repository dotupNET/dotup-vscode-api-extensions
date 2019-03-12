import { createPrinter, createSourceFile, EmitHint, NewLineKind, Node, Printer, ScriptKind, ScriptTarget, SourceFile } from 'typescript';

export class NodePrinter {
  printer: Printer;
  tempFile: SourceFile;

  static printNode(node: Node | Node[]): string {
    const printer = new NodePrinter();

    return printer.printNode(node);
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
