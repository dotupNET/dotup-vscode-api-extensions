import { GeneratorResult, MemberGeneratorResult, MemberType } from '../generators/GeneratorResult';
import { NodePrinter } from '../generators/NodePrinter';
import { ITemplateProvider } from './ITemplateProvider';
import { TemplateType } from './TemplateEnumerations';

declare type CallTemplateTypes = TemplateType.method | TemplateType.function | TemplateType.asyncFunction | TemplateType.asyncMethod;

export class TemplateParser {
  private readonly templateProvider: ITemplateProvider;

  constructor(templateProvider: ITemplateProvider) {
    this.templateProvider = templateProvider;
  }

  generateFile(generatorResult: GeneratorResult): string {
    const tests: string[] = [];

    generatorResult.classes.forEach(c => {

      // For each class in file
      const className = c.key;
      const classGeneratorResult = c.value;
      const memberStatements: string[] = [];

      // For each member in class
      classGeneratorResult.member.forEach(m => {

        switch (m.memberType) {

          case MemberType.Method:
            const methodStatement = this.generateCallStatements(className, m, TemplateType.method);
            memberStatements.push(methodStatement);
            break;

          case MemberType.AsyncMethod:
            const asyncMethodStatement = this.generateCallStatements(className, m, TemplateType.asyncMethod);
            memberStatements.push(asyncMethodStatement);
            break;

          case MemberType.Function:
            const functionStatement = this.generateCallStatements(className, m, TemplateType.function, 'result');
            memberStatements.push(functionStatement);
            break;

          case MemberType.AsyncFunction:
            const asyncFunctionStatement = this.generateCallStatements(className, m, TemplateType.asyncFunction, 'result');
            memberStatements.push(asyncFunctionStatement);
            break;

          case MemberType.Property:
            const propertyStatement = this.generatePropertyStatements(className, m);
            memberStatements.push(propertyStatement);

        }
        // const statement = this.generateMethodStatements(className, m);
        // methodStatements.push(statement);

      });

      const classTestStatements = memberStatements.join('\n');
      const classTest = this.generateClassStatements(className, classTestStatements);

      tests.push(classTest);
    });

    // Build imports string
    const importsOfClassToTest = generatorResult.classes.map(item => item.value.classImport);
    const allImports = importsOfClassToTest.concat(generatorResult.imports.nodes);
    const imports = NodePrinter.printNode(allImports);

    // Build statement string
    const testStatements = tests.join('\n');

    const fileContent = this.generateFileStatements(imports, testStatements);

    // Add header
    if (generatorResult.headers.nodes.length > 0) {
      const headerText = NodePrinter.printNode(generatorResult.headers);
      fileContent.unshift(headerText);
    }

    return fileContent.join('\n');
  }

  generateFileStatements(imports: string, fileTestStatements: string): string[] {
    const templates = this.templateProvider.getTemplate(TemplateType.file);
    if (templates.length < 1) {
      throw new Error('Could not found template for test type "file"');
    }

    const result: string[] = [];

    templates.forEach(t => {
      let template = t;
      template = template.replace(/\$\{Imports\}/g, imports);
      template = template.replace(/\$\{FileTests\}/g, fileTestStatements);
      result.push(template);
    });

    return result;
  }

  generateClassStatements(className: string, classTestStatements: string): string {
    // const text = builder.print();

    const templates = this.templateProvider.getTemplate(TemplateType.class);
    if (templates.length < 1) {
      throw new Error('Could not found template for test type "class"');
    }

    const result: string[] = [];

    templates.forEach(t => {
      let template = t;
      template = template.replace(/\$\{ClassName\}/g, className);
      template = template.replace(/\$\{ClassTests\}/g, classTestStatements);
      result.push(template);
    });

    return result.join('\n');
  }

  // generateMethodStatements(className: string, test: MemberGeneratorResult): string {
  //   // const text = builder.print();
  //   // const importsText = NodePrinter.printNode(test.imports);
  //   const testStatement = NodePrinter.printNode(test.statements);
  //   const variableText = NodePrinter.printNode(test.variables);

  //   const templates = this.templateProvider.getTemplate(TemplateType.method);
  //   if (templates.length < 1) {
  //     throw new Error('Could not found template for test type "method"');
  //   }

  //   const result: string[] = [];

  //   templates.forEach(t => {
  //     let template = t;
  //     template = template.replace(/\$\{Declarations\}/g, variableText);
  //     template = template.replace(/\$\{MemberTests\}/g, testStatement);
  //     template = template.replace(/\$\{MethodName\}/g, test.memberName);
  //     template = template.replace(/\$\{ClassName\}/g, className);
  //     // template = template.replace(/\$\{MethodCallResult\}/g, 'result'); // TODO...
  //     result.push(template);
  //   });

  //   return result.join('\n');
  // }

  // generateFunctionStatements(className: string, test: MemberGeneratorResult): string {
  //   // const text = builder.print();
  //   // const importsText = NodePrinter.printNode(test.imports);
  //   const testStatement = NodePrinter.printNode(test.statements);
  //   const variableText = NodePrinter.printNode(test.variables);

  //   const templates = this.templateProvider.getTemplate(TemplateType.function);
  //   if (templates.length < 1) {
  //     throw new Error('Could not found template for test type "function"');
  //   }

  //   const result: string[] = [];

  //   templates.forEach(t => {
  //     let template = t;
  //     template = template.replace(/\$\{Declarations\}/g, variableText);
  //     template = template.replace(/\$\{MemberTests\}/g, testStatement);
  //     template = template.replace(/\$\{MethodName\}/g, test.memberName);
  //     template = template.replace(/\$\{ClassName\}/g, className);
  //     template = template.replace(/\$\{MethodCallResult\}/g, 'result'); // TODO...
  //     result.push(template);
  //   });

  //   return result.join('\n');
  // }

  generateCallStatements(className: string, test: MemberGeneratorResult, templateType: CallTemplateTypes, callResult?: string): string {
    // const text = builder.print();
    // const importsText = NodePrinter.printNode(test.imports);
    const testStatement = NodePrinter.printNode(test.statements);
    const variableText = NodePrinter.printNode(test.variables);

    const templates = this.templateProvider.getTemplate(templateType);
    if (templates.length < 1) {
      throw new Error(`'Could not found template for test type "${templateType.toString()}"`);
    }

    const result: string[] = [];

    templates.forEach(t => {
      let template = t;
      template = template.replace(/\$\{Declarations\}/g, variableText);
      template = template.replace(/\$\{MemberTests\}/g, testStatement);
      template = template.replace(/\$\{MethodName\}/g, test.memberName);
      template = template.replace(/\$\{ClassName\}/g, className);
      if (callResult !== undefined) {
        template = template.replace(/\$\{MethodCallResult\}/g, callResult); // TODO...
      }
      template = template.trim();

      result.push(template);
    });

    return result.join('\n');
  }

  generatePropertyStatements(className: string, test: MemberGeneratorResult): string {
    // const text = builder.print();
    // const importsText = NodePrinter.printNode(test.imports);
    const testStatement = NodePrinter.printNode(test.statements);
    const variableText = NodePrinter.printNode(test.variables);

    const templates = this.templateProvider.getTemplate(TemplateType.property);
    if (templates.length < 1) {
      throw new Error('Could not found template for test type "property"');
    }

    const result: string[] = [];

    templates.forEach(t => {
      let template = t;
      template = template.replace(/\$\{Declarations\}/g, variableText);
      template = template.replace(/\$\{MemberTests\}/g, testStatement);
      template = template.replace(/\$\{PropertyName\}/g, test.memberName);
      template = template.replace(/\$\{ClassName\}/g, className);
      template = template.replace(/\$\{PropertySetVariable\}/g, test.propertySetVariableName); // TODO...
      template = template.replace(/\$\{PropertyGetResult\}/g, 'result'); // TODO...
      result.push(template);
    });

    return result.join('\n');
  }

}
