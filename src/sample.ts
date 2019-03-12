import * as path from 'path';
import { FileAnalyser } from './analyser/FileAnalyser';
import { SourceFileDescriptor } from './descriptors';
import { GeneratorContext } from './generators/GeneratorContext';
import { NodeBuilder } from './generators/NodeBuilder';
import { TestGenerator } from './generators/TestGenerator';
import { SourceFileWriter } from './SourceFileWriter';
import { TemplateParser } from './templates/TemplateParser';
import { TemplateProvider } from './templates/TemplateProvider';

export class Sample {

  constructor(no: number) {

  }

  run(file?: string): void {
    // tslint:disable-next-line: no-parameter-reassignment
    file = 'sample.ts';
    const builder = new NodeBuilder();
    const sourceFile = this.getDescriptor(file);
    // const methods = sourceFile.classDescriptors
    //   .map(c => c.methods)
    //   .reduce((p, c) => p.concat(c));

    // const nodes: Node[] = [];
    // methods.forEach(m => {
    //   const items = TestGenerator.generateMethodCall('myNiceObject', m);
    //   if (items.length > 0) {
    //     nodes.push(...items);
    //   }
    // });

    const testStatementTemplate = `
      "describe('\${moduleName}', () => {",
	    "\tit('', () => {",
	    "\${testStatement}",
	    "\t})",
	    "})"
    `;
    let targetPath = __dirname; // .replace('\src', '\test');
    targetPath = targetPath.replace(/\\[^\\]*$/, '\\test');
    // result = dialog.replace(/,\s(\w+)$/, " and $1");

    targetPath = `${targetPath}\\${path.basename(file, '.ts')}.test.ts`;

    const context = new GeneratorContext(sourceFile, targetPath);

    const tg = new TestGenerator();
    const generatorResult = tg.generateTests(context);
    // const classTest = tg.generateClassTest(
    //   context.sourceDescriptor,
    //   context.targetDescriptor,
    //   sourceFile.classDescriptors[0].className);

    // const sourceFilePath = `${__dirname.replace('\dist', '\src')}/${file}.test.ts`;

    const templateParser = new TemplateParser(new TemplateProvider());
    const x = templateParser.generateFile(generatorResult);

    // Write to file
    const fileWriter = new SourceFileWriter();
    fileWriter.writeString(context.targetDescriptor, x);

    // context.targetDescriptor.nodes = classTest.nodes;
    // fileWriter.write(context.targetDescriptor);

    // const result = NodePrinter.printNode(classTest.nodes);
    console.log(x);
  }

  getDescriptor(file: string): SourceFileDescriptor {
    const sourceFilePath = `${__dirname.replace('\dist', '\src')}/${file}`;
    // Analyse source file
    const fileAnalyser = new FileAnalyser();

    return fileAnalyser.analyseFile(sourceFilePath, undefined);
  }

}

const sample = new Sample(4);
sample.run();
