export enum TemplateType {
  File,
  Class,
  MethodTest,
  Property,
  ImportStatement
}

export enum TemplatePlaceHolder {
  Imports = 'Imports',
  FileTests = 'FileTests',
  ClassTests = 'ClassTests',
  MethodTests = 'MethodTests',
  Declarations = 'Declarations',

  FileName = 'FileName',
  ClassName = 'ClassName',
  MethodName = 'MethodName'
}

export class TemplateProvider {

  getTemplate(template: TemplateType): string {

    switch (template) {
      case TemplateType.File:
        // tslint:disable-next-line: no-invalid-template-strings
        return `
          \${Imports}
          \${FileTests}`;

      case TemplateType.Class:
        // tslint:disable-next-line: no-invalid-template-strings
        return `
          describe('Test class \${ClassName}', () => {
            \${ClassTests}
          });`;

      case TemplateType.MethodTest:
        // tslint:disable-next-line: no-invalid-template-strings
        return `
          it('\${MethodName}', () => {
            // Arguments
            \${Declarations}

            // Method call
            \${MethodTests}
          });`;

    }

    return '';
  }

}
