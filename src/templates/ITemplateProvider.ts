import { TemplateType } from './TemplateEnumerations';

/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2019-03-12 13:21:34
 */
export interface ITemplateProvider {
  getTemplate(template: TemplateType): string[];
}