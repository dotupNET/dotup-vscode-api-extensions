import { ImportDeclaration, Node } from 'typescript';
import { ClassDescriptor } from './ClassDescriptor';
export class SourceFileDescriptor {
  // source
  readonly sourceFilePath: string;
  sourceFileContent: string;
  syntaxList: Node;
  classDeclarations: Node[];
  importClause?: Node[];
  // Interface
  importDeclarations: ImportDeclaration[];
  classDescriptors: ClassDescriptor[];
  // nodes: Node[];

  constructor(sourceFileName: string) {
    // source
    this.sourceFilePath = sourceFileName;
    this.classDeclarations = [];
    // interface
    // this.nodes = [];
    this.classDescriptors = [];
  }

  isSourceValid(): boolean {
    if (this.sourceFilePath === undefined || this.sourceFilePath.length < 1) {
      return false;
    }
    if (this.sourceFileContent === undefined || this.sourceFileContent.length < 1) {
      return false;
    }
    if (this.syntaxList === undefined) {
      return false;
    }
    if (this.classDeclarations.length < 1) {
      return false;
    }

    return true;
  }

  isValidInterface(): boolean {
    // if (this.nodes.length < 1) {
    //   return false;
    // }
    if (this.classDescriptors.length < 1) {
      return false;
    }

    return true;
  }

}
