// tslint:disable-next-line: no-implicit-dependencies
import { createIdentifier, createInterfaceDeclaration, createToken, InterfaceDeclaration, Node, SyntaxKind } from 'typescript';
import { ClassDescriptor } from '../descriptors/ClassDescriptor';
import { ExtendedNode } from '../interfaces/ExtendedNode';
import { INodeBuilder } from '../interfaces/INodeBuilder';

export class InterfaceGenerator implements INodeBuilder {

  // getInterfaceDeclaration(interfaceDescriptor: InterfaceDescriptor): InterfaceDeclaration {
  //   // Interface
  //   return createInterfaceDeclaration(
  //     undefined,
  //     interfaceDescriptor.modifiers,
  //     interfaceDescriptor.interfaceName,
  //     interfaceDescriptor.typeParameters,
  //     interfaceDescriptor.heritageClauses,
  //     interfaceDescriptor.getMembersAsTypeElement()
  //   );
  // }

  buildNodes(descriptor: ClassDescriptor): Node[] {
    const result: Node[] = [];

    if (descriptor.jsDoc !== undefined) {
      descriptor.jsDoc.forEach(comment => {
        result.push(comment);
      });
    }

    const identifier = createIdentifier(this.getInterfaceDeclarationString(descriptor));

    result.push(identifier);

    // Properties
    // result.push(...item.getPropertiesAsNode());
    const props = descriptor.getPropertiesAsNode();

    this.addNodeWithCommentToResult(props, result);

    // New line
    result.push(createToken(SyntaxKind.NewLineTrivia));

    // Methods
    // result.push(...interfaceDescriptor.getMethodsAsNode());
    const methods = descriptor.getMethodsAsNode();
    this.addNodeWithCommentToResult(methods, result);

    // New line
    result.push(createToken(SyntaxKind.NewLineTrivia));

    // Closing brace
    const closeBrace = createToken(SyntaxKind.CloseBraceToken);
    result.push(closeBrace);

    return result;

  }

  addNodeWithCommentToResult(source: ExtendedNode[], target: Node[]): void {
    source.forEach(p => {
      if (p.jsDoc !== undefined) {
        target.push(...p.jsDoc);
      }
      target.push(p);
    });

  }

  getInterfaceDeclarationString(item: ClassDescriptor): string {
    let result = item.classDeclarationString.replace('class', 'interface');
    result = result.replace(item.className, item.interfaceName);
    // export class ExtendsOnly<XY, TG extends string> extends ABC {
    // =>
    // export class ExtendsOnly<XY, TG extends string>
    // const withTypeParameters = result.match(/.+?(?=>)./);
    // if (withTypeParameters !== null) {
    //   return `${withTypeParameters[0]} {`;
    // }

    // 'extends' clause must precede 'implements' clause.ts(1173)
    // const extendsParameters = result.match(/.+?(?=extends)/);
    // if (extendsParameters !== null) {
    //   return `${extendsParameters[0]} {`;
    // }

    const implementsParameters = result.match(/.+?(?=implements)/);
    if (implementsParameters !== null) {
      return `${implementsParameters[0]} {`;
    }

    return result;

  }

}
