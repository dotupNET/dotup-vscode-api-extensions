import { MethodSignature, Node, createPrinter, EmitHint, createSourceFile, ScriptTarget, ScriptKind, NewLineKind, createToken, SyntaxKind, createIdentifier, createCall, createParameter, createExpressionStatement, createExpressionWithTypeArguments, createNodeArray, Identifier } from 'typescript';
import { NodeBuilder } from './NodeBuilder';
import { ClassDescriptor } from '../descriptors';
import { tools } from '../tools';
import { IdentifierProvider } from '../providers/IdentifierProvider';
import { NodeAnalyser } from '../analyser/NodeAnalyser';
import { IParameterDescriptor } from '../descriptors/IParameterDescriptor';

export class TestGenerator {
  readonly identifierProvider: IdentifierProvider;

  constructor(identifierProvider?: IdentifierProvider) {
    this.identifierProvider = identifierProvider || new IdentifierProvider();
  }

  private getName(name: string): string {
    return this.identifierProvider.getName(name);
  }

  generateClassMethodCalls(classDescriptor: ClassDescriptor): Node[] {
    const builder = new NodeBuilder();
    const methods = classDescriptor.methods;

    let ctorArgs = '';

    const ctor = classDescriptor.ctors.reduce((p, c) => {
      return p.parameters.length > c.parameters.length ? p : c;
    });

    if (ctor.parameters.length > 0) {
      // Generate constructor arguments
      const params = NodeAnalyser.getParameterDescriptor(ctor.parameters, (name) => this.getName(name));
      const variables = this.generateVariableDeclarations(params); //.map(p => createIdentifier(`const ${p.name} = ${p.value};`));
      builder.add(variables);

      ctorArgs = params.map(p => p.name).join(', ');
    }

    const classInstanceName = this.getName(tools.camelCase(classDescriptor.className));
    const instance = `const ${classInstanceName} = new ${classDescriptor.className}(${ctorArgs});`;
    builder.add(createIdentifier(instance));

    builder.addNewLine();

    methods.forEach(m => {
      const items = this.generateMethodCall(classInstanceName, m);
      if (items.length > 0) {
        builder.add(items);
      }
      builder.addNewLine();
    });

    return builder.nodes;
  }

  generateMethodCall(objectName: string, method: MethodSignature): Node[] {
    const builder = new NodeBuilder();

    const params = NodeAnalyser.getParameterDescriptor(method.parameters, (name) => this.getName(name));

    // const params = method.parameters.map(p => {
    //   return {
    //     name: this.getName(builder.printNode(p.name)),
    //     // parameterDeclaration: p,
    //     typeName: p.type.getText(),
    //     value: builder.valueProvider.getValue(p.type.getText())
    //   };
    // });

    // Declare all arguments as variable
    // const args: Node[] = method.parameters.map(item => {
    //   const varName = this.getName(builder.printNode(item));
    //   return createIdentifier(`const ${varName} = ${builder.valueProvider.getValue(item.type.getText())};`);
    // });
    // builder.add(args);

    let argumentNames: string[];

    if (params.length > 0) {
      // Create variable for each argument
      const variables = this.generateVariableDeclarations(params); //.map(p => createIdentifier(`const ${p.name} = ${p.value};`));
      builder.add(variables);
      // Create argument names
      argumentNames = params.map(p => p.name);
    }

    // Create a call
    builder.addMethodCall(method.name.getText(), objectName, argumentNames);

    return builder.nodes;
  }

  generateVariableDeclarations(params: IParameterDescriptor[]): Identifier[] {
    if (params.length > 0) {
      // Create variable for each argument
      return params.map(p => createIdentifier(`const ${p.name} = ${p.value};`));
    } else {
      return undefined;
    }
  }

}
