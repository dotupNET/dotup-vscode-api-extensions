// tslint:disable-next-line: max-line-length
import { createPrinter, createSourceFile, EmitHint, NewLineKind, Node, ScriptKind, ScriptTarget, SourceFile } from 'typescript';
import { TargetFileDescriptor } from '../descriptors/TargetFileDescriptor';
// import { InterfaceGenerator } from './InterfaceGenerator';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

export class SourceFileGenerator {

  createFile(targetDescriptor: TargetFileDescriptor): SourceFile {
    const result: string[] = [];
    const fileName = targetDescriptor.targetFilePath;
    const nodes = targetDescriptor.nodes;

    const resultFile = createSourceFile(
      fileName,
      '',
      ScriptTarget.Latest,
      false,
      ScriptKind.TS
    );

    const printer = createPrinter(
      {
        newLine: NewLineKind.CarriageReturnLineFeed
      },
      {
        substituteNode(hint, node) {
          // perform substitution if necessary...
          return node;
        }
      }
    );

    // const result = printer.printNode(
    //   EmitHint.Unspecified,
    //   node,
    //   resultFile
    // );

    if (nodes.length > 0) {
      // this.out.appendLine(`Printing nodes`);

      nodes.forEach(item => {
        const x = printer.printNode(EmitHint.Unspecified, item, resultFile);
        result.push(x);
        console.log(x);
      });

      resultFile.text = result.join('\n');
    } else {
      // this.out.appendLine('No nodes to print!');
    }

    return resultFile;
  }

}
