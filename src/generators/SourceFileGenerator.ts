// tslint:disable-next-line: max-line-length
import { createPrinter, createSourceFile, EmitHint, NewLineKind, ScriptKind, ScriptTarget, SourceFile } from 'typescript';
import { TargetFileDescriptor } from '../descriptors/TargetFileDescriptor';
// import { InterfaceGenerator } from './InterfaceGenerator';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

export class SourceFileGenerator {

  createFile(fileDescriptor: TargetFileDescriptor): SourceFile {
    const result: string[] = [];

    const resultFile = createSourceFile(
      fileDescriptor.targetFilePath,
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

    if (fileDescriptor.nodes.length > 0) {
      // this.out.appendLine(`Printing nodes`);

      fileDescriptor.nodes.forEach(item => {
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
