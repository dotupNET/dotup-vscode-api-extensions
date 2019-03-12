import { GeneratorResult, MemberGeneratorResult } from '../generators/GeneratorResult';
import { NodePrinter } from '../generators/NodePrinter';
import { TemplateProvider, TemplateType } from './TemplateProvider';

export class TemplateParser {
  private readonly templateProvider: TemplateProvider;

  constructor(templateProvider: TemplateProvider) {
    this.templateProvider = templateProvider;
  }

  generateFile(generatorResult: GeneratorResult): string {
    const tests: string[] = [];

    generatorResult.classes.forEach(c => {

      // For each class in file
      const className = c.key;
      const classGeneratorResult = c.value;
      const methodStatements: string[] = [];

      // For each member in class
      classGeneratorResult.member.forEach(m => {

        const statement = this.generateMethodStatements(m);
        methodStatements.push(statement);

      });

      const classTestStatements = methodStatements.join('\n');
      const classTest = this.generateClassStatements(className, classTestStatements);

      tests.push(classTest);
    });

    const importClassToTest = generatorResult.classes.map(item => item.value.classImport);
    const allImports = importClassToTest.concat(generatorResult.imports.nodes);
    const imports = NodePrinter.printNode(allImports);
    const testStatements = tests.join('\n');

    return this.generateFileStatements(imports, testStatements);
  }

  generateFileStatements(imports: string, fileTestStatements: string) {
    let template = this.templateProvider.getTemplate(TemplateType.File);

    template = template.replace(/\$\{Imports\}/g, imports);
    template = template.replace(/\$\{FileTests\}/g, fileTestStatements);

    return template;

  }

  generateClassStatements(className: string, classTestStatements: string): string {
    // const text = builder.print();

    let template = this.templateProvider.getTemplate(TemplateType.Class);

    template = template.replace(/\$\{ClassName\}/g, className);
    template = template.replace(/\$\{ClassTests\}/g, classTestStatements);

    return template;
  }

  generateMethodStatements(test: MemberGeneratorResult): string {
    // const text = builder.print();
    // const importsText = NodePrinter.printNode(test.imports);
    const testStatement = NodePrinter.printNode(test.statements);
    const variableText = NodePrinter.printNode(test.variables);

    let template = this.templateProvider.getTemplate(TemplateType.MethodTest);

    template = template.replace(/\$\{Declarations\}/g, variableText);
    template = template.replace(/\$\{MethodTests\}/g, testStatement);
    template = template.replace(/\$\{MethodName\}/g, test.memberName);

    return template;
  }

}
