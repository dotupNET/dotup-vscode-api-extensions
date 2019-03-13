import * as path from 'path';
// tslint:disable-next-line: no-implicit-dependencies
import { createIdentifier, Identifier, LiteralLikeNode, MethodSignature, Node, PropertySignature } from 'typescript';
import { NodeAnalyser } from '../analyser/NodeAnalyser';
import { ClassDescriptor, SourceFileDescriptor, TargetFileDescriptor } from '../descriptors';
import { IParameterDescriptor } from '../descriptors/IParameterDescriptor';
import { IdentifierProvider } from '../providers/IdentifierProvider';
import { tools } from '../tools';
import { GeneratorContext } from './GeneratorContext';
import { ClassGeneratorResult, GeneratorResult, MemberGeneratorResult, MemberType } from './GeneratorResult';
import { NodeBuilder } from './NodeBuilder';
import { NodeGenerator } from './NodeGenerator';
import { NodePrinter } from './NodePrinter';

export class TestGenerator {
  readonly identifierProvider: IdentifierProvider;

  constructor(identifierProvider?: IdentifierProvider) {
    this.identifierProvider = identifierProvider || new IdentifierProvider();
  }

  private getName(name: string): string {
    return this.identifierProvider.getName(name);
  }

  generateTests(context: GeneratorContext): GeneratorResult {
    // const builder = new NodeBuilder();

    const result = new GeneratorResult();

    // generate imports from source file
    const importsFromSource = this.generateImports(context);
    // builder.add(importsFromSource);
    result.addImports(importsFromSource);

    // For each class in file
    context.sourceDescriptor.classDescriptors.forEach(cd => {
      const generatedClass = this.generateClassTest(context.sourceDescriptor, context.targetDescriptor, cd.className);

      result.addClass(cd.className, generatedClass);
      // builder.add(cdNodes);
    });

    // TODO: Hm not nice
    // context.targetDescriptor.nodes = builder.nodes;
    return result;
  }

  // NodeBuilder {
  generateClassTest(source: SourceFileDescriptor, target: TargetFileDescriptor, className: string): ClassGeneratorResult {
    const result = new ClassGeneratorResult();
    // const builder = new NodeBuilder();
    const classDescriptor = source.classDescriptors.find(item => item.className === className);

    // source file import
    const template = `import { \${moduleName} } from '\${modulePath}';`;

    const imports = tools.createImportStatements(
      source.sourceFilePath,
      target.targetFilePath,
      className,
      [template]
    );

    result.classImport = NodeGenerator.getStatement(imports);

    // Method calls
    classDescriptor.methods.forEach(m => {
      const memberCall = this.generateMethodCall(classDescriptor, m);
      result.member.push(memberCall);
      // builder.addNewLine();
    });

    // Property calls
    classDescriptor.properties.forEach(p => {
      const memberCall = this.generatePropertyCall(classDescriptor, p);
      result.member.push(memberCall);
      // builder.addNewLine();
    });

    // return builder;
    return result;
  }

  generateMethodCall(classDescriptor: ClassDescriptor, method: MethodSignature): MemberGeneratorResult {
    const methodName = method.name.getText();

    // Is this a method or a function with return value=
    const methodReturnsResult = method.type !== undefined;

    // Result
    const result = new MemberGeneratorResult();
    result.memberType = methodReturnsResult ? MemberType.Function : MemberType.Method;
    result.memberName = methodName;

    // Class instance
    const instance = this.generateClassInstance(classDescriptor);
    result.variables.push(...instance.variables);
    result.statements.push(...instance.statements);

    // Get method arguments
    const params = NodeAnalyser.getParameterDescriptor(method.parameters, (name) => this.getName(name));

    let argumentNames: string[];

    if (params.length > 0) {
      // Create variable for each argument
      const variables = this.generateVariableDeclarations(params);
      result.variables.push(...variables);
      // Create argument names
      argumentNames = params.map(p => p.name);
    }

    // Create a call
    result.statements.push(NodeGenerator.getMethodCall(methodName, instance.memberName, argumentNames, undefined, methodReturnsResult));

    return result;
  }

  generatePropertyCall(classDescriptor: ClassDescriptor, property: PropertySignature): MemberGeneratorResult {
    const propertyName = property.name.getText();

    // Result
    const result = new MemberGeneratorResult();
    result.memberType = MemberType.Property;
    result.memberName = propertyName;

    // Class instance
    const instance = this.generateClassInstance(classDescriptor);
    result.variables.push(...instance.variables);
    result.statements.push(...instance.statements);

    // Get type descriptor
    const variableDescriptor = NodeAnalyser.getVariableDescriptor(property, (name) => this.getName(name));

    // Create variable for property
    const variable = this.generateVariableDeclarations([variableDescriptor]);
    result.variables.push(...variable);

    result.propertySetVariableName = variableDescriptor.name;

    // Create a set assignment
    result.statements.push(NodeGenerator.getPropertySet(propertyName, instance.memberName, variableDescriptor.name));

    // Create get assignment for result
    result.statements.push(NodeGenerator.getPropertyGet(propertyName, instance.memberName, variableDescriptor.name));

    return result;
  }

  generateClassInstance(classDescriptor: ClassDescriptor): MemberGeneratorResult {
    const classInstanceName = tools.camelCase(classDescriptor.className);

    // Result
    const result = new MemberGeneratorResult();
    result.memberType = MemberType.ClassInstance;
    result.memberName = classInstanceName;

    // Constructor
    let ctorArgs = '';

    if (classDescriptor.ctors.length > 0) {
      // Generate constructor arguments
      const ctor = classDescriptor.ctors.reduce((p, c) => {
        return p.parameters.length > c.parameters.length ? p : c;
      });

      const params = NodeAnalyser.getParameterDescriptor(ctor.parameters, (name) => this.getName(name));
      const variables = this.generateVariableDeclarations(params); // .map(p => createIdentifier(`const ${p.name} = ${p.value};`));
      result.variables.push(...variables);
      // builder.add(variables);

      ctorArgs = params
        .map(p => p.name)
        .join(', ');
    }

    // const statement = new NodeBuilder();
    const instance = `const ${classInstanceName} = new ${classDescriptor.className}(${ctorArgs});`;
    // statement.addStatement(instance);
    result.statements.push(NodeGenerator.getStatement(instance));

    return result;
  }

  generateImports(context: GeneratorContext): Node[] {
    const builder = new NodeBuilder();
    const source = context.sourceDescriptor;

    const relativPath = tools.getRelativePath(
      context.sourceDescriptor.sourceFilePath,
      context.targetDescriptor.targetFilePath);

    // Imports
    if (source.importDeclarations.length >= 0) {
      source.importDeclarations.forEach(item => {
        // tslint:disable-next-line: no-any
        const current = <LiteralLikeNode><any>item.moduleSpecifier;
        if (current.text.startsWith('.') && relativPath !== '') {

          // Change path
          current.text =
            tools.normalizePath(
              path.join(relativPath, current.text)
            );

          let sourceImport = NodePrinter.printNode(item);
          sourceImport = tools.setQuotemark(sourceImport);
          builder.addStatement(sourceImport);
        } else {
          builder.add(item);
        }
      });
      // New line
      // builder.addNewLine();
    }

    return builder.nodes;
  }

  // generateMethodCall(objectName: string, method: MethodSignature): Node[] {
  //   const builder = new NodeBuilder();

  //   const params = NodeAnalyser.getParameterDescriptor(method.parameters, (name) => this.getName(name));

  //   // const params = method.parameters.map(p => {
  //   //   return {
  //   //     name: this.getName(builder.printNode(p.name)),
  //   //     // parameterDeclaration: p,
  //   //     typeName: p.type.getText(),
  //   //     value: builder.valueProvider.getValue(p.type.getText())
  //   //   };
  //   // });

  //   // Declare all arguments as variable
  //   // const args: Node[] = method.parameters.map(item => {
  //   //   const varName = this.getName(builder.printNode(item));
  //   //   return createIdentifier(`const ${varName} = ${builder.valueProvider.getValue(item.type.getText())};`);
  //   // });
  //   // builder.add(args);

  //   let argumentNames: string[];

  //   if (params.length > 0) {
  //     // Create variable for each argument
  //     const variables = this.generateVariableDeclarations(params); // .map(p => createIdentifier(`const ${p.name} = ${p.value};`));
  //     builder.add(variables);
  //     // Create argument names
  //     argumentNames = params.map(p => p.name);
  //   }

  //   // Create a call
  //   builder.addMethodCall(method.name.getText(), objectName, argumentNames);

  //   return builder.nodes;
  // }

  generateVariableDeclarations(params: IParameterDescriptor[]): Identifier[] {
    if (params.length > 0) {
      // Create variable for each argument
      return params.map(p => createIdentifier(`const ${p.name} = ${p.value};`));
    } else {
      return undefined;
    }
  }

}
