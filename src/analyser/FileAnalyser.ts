import * as fs from 'fs';
// tslint:disable-next-line: max-line-length
import { ClassDeclaration, createImportDeclaration, createSourceFile, createStringLiteral, ImportDeclaration, Node, ScriptTarget, SyntaxKind } from 'typescript';
// tslint:disable-next-line: no-implicit-dependencies
import { OutputChannel } from 'vscode';
import { SourceFileDescriptor } from '../descriptors/SourceFileDescriptor';
import { ClassAnalyer } from './ClassAnalyer';
// import { InterfaceGenerator } from './InterfaceGenerator';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

export class FileAnalyser {

  analyseFile(sourceFilePath: string, out: OutputChannel): SourceFileDescriptor {
    const fd = new SourceFileDescriptor(sourceFilePath);

    out.appendLine(`Analysing file ${fd.sourceFilePath}`);

    // tslint:disable-next-line: non-literal-fs-path
    fd.sourceFileContent = fs.readFileSync(fd.sourceFilePath, 'utf-8');
    const sourceFile = createSourceFile(fd.sourceFilePath, fd.sourceFileContent, ScriptTarget.Latest, true);

    const syntaxList = sourceFile
      .getChildren()
      .find(item => item.kind === SyntaxKind.SyntaxList);

    fd.syntaxList = syntaxList;

    fd.importClause = syntaxList
      .getChildren()
      .filter(item => item.kind === SyntaxKind.ImportDeclaration);

    fd.classDeclarations = syntaxList
      .getChildren()
      .filter(item => item.kind === SyntaxKind.ClassDeclaration);

    if (fd.isSourceValid()) {

      // imports
      const imports = this.getImports(fd.importClause);
      fd.importDeclarations = imports;

      // Get all class declarations
      fd.classDeclarations.forEach(c => {

        const ca = new ClassAnalyer();
        const ifd = ca.getClassDescriptor(<ClassDeclaration>c);
        fd.classDescriptors.push(ifd);

      });

    } else {
      out.appendLine('Invalid source file!');
    }

    return fd;
    // this.visit(sourceFile);
  }

  getImports(importClause: Node[]): ImportDeclaration[] {
    return importClause.map(item => {
      const id = <ImportDeclaration>item;
      const name = id.moduleSpecifier
        .getText()
        .replace(/\'/gm, '')
        .replace(/\"/gm, '');

      return createImportDeclaration(
        id.decorators,
        id.modifiers,
        id.importClause,
        createStringLiteral(name)
      );
    });
  }

}
