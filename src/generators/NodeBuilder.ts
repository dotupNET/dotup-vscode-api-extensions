// tslint:disable: newline-before-return
// tslint:disable-next-line: no-implicit-dependencies
import { Node, TypeNode } from 'typescript';
import { ValueProvider } from '../providers/ValueProvider';
import { NodeGenerator } from './NodeGenerator';

export class NodeBuilder {

  nodes: Node[];

  readonly valueProvider: ValueProvider;

  constructor(valueProvider?: ValueProvider) {
    this.nodes = [];
    this.valueProvider = valueProvider || new ValueProvider();
  }

  add(node: Node | Node[]): this {
    if (Array.isArray(node)) {
      node.forEach(item => {
        this.nodes.push(item);
      });
    } else {
      this.nodes.push(node);
    }
    return this;
  }

  addNewLine(): this {
    return this.add(NodeGenerator.getNewLine());
  }

  addComment(text: string): this {
    return this.add(NodeGenerator.getComment(text));
    // return this.addNewLine();
  }

  addMultiLineComment(...text: string[]): this {
    const comment = NodeGenerator.getMultiLineComment(...text);
    comment.forEach(c => this.add(c));
    return this;
  }

  addMethodCall(methodName: string, objectName: string, isAsync: boolean, argNames?: string[], typeParameter?: TypeNode[]): this {
    return this.add(NodeGenerator.getMethodCall(methodName, objectName, isAsync, argNames, typeParameter));
  }

  addStatement(line: string): this {
    return this.add(NodeGenerator.getStatement(line));
  }

}
