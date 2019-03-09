// tslint:disable-next-line: max-line-length
import { createToken, Node, SyntaxKind } from 'typescript';
import { SourceFileDescriptor } from '../descriptors';
import { TargetFileDescriptor } from '../descriptors/TargetFileDescriptor';
import { INodeBuilder } from '../interfaces/INodeBuilder';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

// TODO: This is a TargetFileGenerator !! Replace SourceFileDescriptor...
export class SourceToTargetFileConverter {

  buildNodes(targetFilePath: string, sourceFileDescriptor: SourceFileDescriptor, nodeBuilder: INodeBuilder): TargetFileDescriptor {
    const result = new TargetFileDescriptor(targetFilePath);

    // Imports
    if (sourceFileDescriptor.importDeclarations.length >= 0) {
      sourceFileDescriptor.importDeclarations.forEach(item => result.addNode(item));
      // New line
      result.addNode(createToken(SyntaxKind.NewLineTrivia));
    }

    // For each class
    sourceFileDescriptor.classDescriptors.forEach(item => {

      // this.out.appendLine(`Build nodes for ${item.interfaceName}`);

      const interfaceNodes = nodeBuilder.buildNodes(item);
      result.addNode(interfaceNodes);

    });

    return result;
  }

}
