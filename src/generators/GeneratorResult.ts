// tslint:disable-next-line: no-implicit-dependencies
import { KeyValuePair } from 'dotup-ts-types';
// tslint:disable-next-line: no-implicit-dependencies
import { Node } from 'typescript';
import { NodeBuilder } from './NodeBuilder';

export enum MemberType {
  AsyncMethod,
  Method,
  AsyncFunction,
  Function,
  Property,
  ClassInstance
}

export class GeneratorResult {
  readonly headers: NodeBuilder;
  readonly imports: NodeBuilder;
  readonly classes: KeyValuePair<string, ClassGeneratorResult>[];

  constructor() {
    this.imports = new NodeBuilder();
    this.headers = new NodeBuilder();
    this.classes = [];
  }

  addImports(nodes: Node[]): void {
    this.imports.add(nodes);
  }

  addClass(className: string, classGeneratorResult: ClassGeneratorResult) {
    this.classes.push({
      key: className,
      value: classGeneratorResult
    });
  }

}

export class ClassGeneratorResult {
  classImport: Node;
  readonly member: MemberGeneratorResult[];
  readonly variables: Node[];
  // classInstanceStatement: Node;

  constructor() {
    this.member = [];
    this.variables = [];
  }
}

export class MemberGeneratorResult {
  memberType: MemberType;
  readonly resultStatements: Node[];
  readonly statements: Node[];
  readonly variables: Node[];
  propertySetVariableName: string;
  memberName: string;

  constructor() {
    this.variables = [];
    this.statements = [];
    this.resultStatements = [];
  }

}
