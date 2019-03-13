import { ITemplateProvider } from './ITemplateProvider';
import { TemplateType } from './TemplateEnumerations';

export class TemplateProvider implements ITemplateProvider {

  getTemplate(templateType: TemplateType): string[] {

    switch (templateType) {
      case TemplateType.file:
        // tslint:disable-next-line: no-invalid-template-strings
        return [`
          \${Imports}
          \${FileTests}`];

      case TemplateType.class:
        // tslint:disable-next-line: no-invalid-template-strings
        return [`
          describe('Test class \${ClassName}', () => {
            \${ClassTests}
          });`];

      case TemplateType.method:
        // tslint:disable-next-line: no-invalid-template-strings
        return [`
          it('\${MethodName}', () => {
            // Arguments
            \${Declarations}

            // Method call
            \${MemberTests}
          });`];

      case TemplateType.function:
        // tslint:disable-next-line: no-invalid-template-strings
        return [`
          it('\${MethodName}', () => {
            // Arguments
            \${Declarations}

            // Method call
            \${MemberTests}
          });`];

    }

    throw new Error(`Template for "${templateType}" not configured`);
  }

}
