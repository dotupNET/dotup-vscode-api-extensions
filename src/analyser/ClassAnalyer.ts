// tslint:disable-next-line: max-line-length
import { ClassLikeDeclarationBase, ConstructorDeclaration, createMethodSignature, createModifier, createPropertySignature, MethodDeclaration, MethodSignature, Node, PropertyDeclaration, PropertySignature, SyntaxKind, Modifier, NodeArray } from 'typescript';
import { ClassDescriptor } from '../descriptors/ClassDescriptor';
import { ExtendedNode } from '../interfaces/ExtendedNode';
import { NodeAnalyser } from './NodeAnalyser';

export class ClassAnalyer {

  getClassDescriptor(classDeclaration: ClassLikeDeclarationBase): ClassDescriptor {

    const descriptor = new ClassDescriptor(classDeclaration.name.text);
    descriptor.classDeclaration = classDeclaration;

    // const ctorArgs = this.createTypeParameter(ctor[0]));

    descriptor.classDeclarationString = classDeclaration
      .getText()
      .split('\n')[0];
    descriptor.modifiers = [createModifier(SyntaxKind.ExportKeyword)];

    descriptor.ctors = this.getConstructors(classDeclaration);
    descriptor.methods = this.getMethods(classDeclaration);
    descriptor.properties = this.getProperties(classDeclaration);
    descriptor.typeParameters = NodeAnalyser.getTypeParameterDeclaration(classDeclaration.typeParameters);
    // tslint:disable-next-line: no-any : no-unsafe-any
    descriptor.jsDoc = (<any>classDeclaration).jsDoc;

    return descriptor;

  }

  getMethods(classDeclaration: ClassLikeDeclarationBase): MethodSignature[] {

    const classMethodsNodes = classDeclaration.members.filter(m => m.kind === SyntaxKind.MethodDeclaration);
    const classMethods = <MethodDeclaration[]>classMethodsNodes;

    // Filter to public methods
    const publicMethods = classMethods
      .filter(method => {
        if (method.modifiers === undefined) {
          return true;
        }

        return method.modifiers.some(item => item.kind === SyntaxKind.PublicKeyword);
      });

    // create method signatures
    return publicMethods.map(method => {
      const m = createMethodSignature(
        NodeAnalyser.getTypeParameterDeclaration(method.typeParameters),
        method.parameters,
        method.type,
        method.name,
        method.questionToken
      );

      this.assignComments(method, m);

      return m;
    });
  }

  getProperties(classDeclaration: ClassLikeDeclarationBase): PropertySignature[] {

    const classPropertyNodes = classDeclaration.members.filter(m => m.kind === SyntaxKind.PropertyDeclaration);
    const classProperties = <PropertyDeclaration[]>classPropertyNodes;

    // Filter to public properties
    const publicProperties = classProperties
      .filter(prop => {
        if (prop.modifiers === undefined) {
          return true;
        }

        return prop.modifiers.some(item => item.kind === SyntaxKind.PublicKeyword);
      });

    // create property signatures
    return publicProperties.map(property => {

      const p = createPropertySignature(
        this.filterModifier(property.modifiers, SyntaxKind.PublicKeyword),
        property.name,
        property.questionToken,
        property.type,
        property.initializer
      );

      this.assignComments(property, p);

      return p;
    });

  }

  filterModifier(modifiers: NodeArray<Modifier>, excluded: SyntaxKind): Modifier[] {
    if (modifiers === undefined) {
      return undefined;
    }

    return modifiers.filter(x => x.kind !== excluded);
  }

  getConstructors(classDeclaration: ClassLikeDeclarationBase): ConstructorDeclaration[] {

    const ctors = classDeclaration.members.filter(m => m.kind === SyntaxKind.Constructor);
    const constructors = <ConstructorDeclaration[]>ctors;

    // Filter to public constructors
    // tslint:disable-next-line: no-unnecessary-local-variable
    const publicCtors = constructors
      .filter(method => {
        if (method.modifiers === undefined) {
          return true;
        }

        return method.modifiers.some(item => item.kind === SyntaxKind.PublicKeyword);
      });

    return publicCtors;
  }

  // tslint:disable
  assignComments<TSource, TTarget>(source: ExtendedNode, target: ExtendedNode): void {
    if (source.jsDoc !== undefined) {
      target.jsDoc = source.jsDoc;
      // target.jsDoc[0].parent = target;
    }
  }
  // tslint:enable

}
