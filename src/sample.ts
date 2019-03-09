import { FileAnalyser } from './analyser/FileAnalyser';
import { SourceFileDescriptor, TargetFileDescriptor } from './descriptors';
import { TestGenerator } from './generators/TestGenerator';
import { createPrinter, Node } from 'typescript';
import { SourceFileGenerator } from './generators';
import { NodeBuilder } from './generators/NodeBuilder';
import { SourceFileWriter } from './SourceFileWriter';

export class Sample {

  constructor(no: number) {

  }

  run(file?: string): void {
    const builder = new NodeBuilder();
    const sourceFile = this.getDescriptor('sample.ts');
    const methods = sourceFile.classDescriptors
      .map(c => c.methods)
      .reduce((p, c) => p.concat(c));

    // const nodes: Node[] = [];
    // methods.forEach(m => {
    //   const items = TestGenerator.generateMethodCall('myNiceObject', m);
    //   if (items.length > 0) {
    //     nodes.push(...items);
    //   }
    // });

    const tg = new TestGenerator();
    const nodes = tg.generateClassMethodCalls(sourceFile.classDescriptors[0]);


    // Write to file
    // const fileWriter = new SourceFileWriter();
    // const sourceFilePath = `${__dirname.replace('\dist', '\src')}/${file}.test.ts`;
    // const target = new TargetFileDescriptor(sourceFilePath);
    // target.nodes = nodes;
    // fileWriter.write(target);

    // const result = builder.printNode(nodes);
    // console.log(result);
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
