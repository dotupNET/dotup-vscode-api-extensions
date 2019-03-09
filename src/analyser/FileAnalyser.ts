import * as fs from 'fs';
// tslint:disable-next-line: max-line-length
import { ClassDeclaration, createImportDeclaration, createSourceFile, createStringLiteral, ImportDeclaration, Node, ScriptTarget, SyntaxKind } from 'typescript';
// tslint:disable-next-line: no-implicit-dependencies
import { OutputChannel } from 'vscode';
import { SourceFileDescriptor } from '../descriptors/SourceFileDescriptor';
import { ClassAnalyer } from './ClassAnalyer';
import { SourceAnalyser } from './SourceAnalyser';
// import { InterfaceGenerator } from './InterfaceGenerator';

// https://medium.com/@marvin_78330/creating-typescript-with-the-typescript-compiler-ac3370701d7f

export class FileAnalyser {

  analyseFile(sourceFilePath: string, out: OutputChannel): SourceFileDescriptor {
    // out.appendLine(`Analysing file ${sourceFilePath}`);
    const analyser = new SourceAnalyser();
    // tslint:disable-next-line: non-literal-fs-path
    const sourceFileContent = fs.readFileSync(sourceFilePath, 'utf-8');

    return analyser.analyse(sourceFilePath, sourceFileContent);
  }

}
