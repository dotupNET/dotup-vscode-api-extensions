// tslint:disable-next-line: no-implicit-dependencies
import { createTypeParameterDeclaration, NodeArray, ParameterDeclaration, TypeParameterDeclaration } from 'typescript';
import { IParameterDescriptor } from '../descriptors/IParameterDescriptor';
import { NodeBuilder } from '../generators/NodeBuilder';
import { NodePrinter } from '../generators/NodePrinter';

export namespace NodeAnalyser {

  export function getTypeParameterDeclaration(typeParameters: NodeArray<TypeParameterDeclaration>): TypeParameterDeclaration[] {
    if (typeParameters === undefined) {
      return undefined;
    } else {
      return typeParameters.map(m =>
        createTypeParameterDeclaration(
          m.name, m.constraint, m.default
        )
      );
    }
  }

  // tslint:disable-next-line: max-line-length
  export function getParameterDescriptor(parameters: NodeArray<ParameterDeclaration>, nameProvider: (name: string) => string): IParameterDescriptor[] {
    const builder = new NodeBuilder();

    return parameters.map(p => {
      return {
        name: nameProvider(NodePrinter.printNode(p.name)),
        // parameterDeclaration: p,
        typeName: p.type.getText(),
        value: builder.valueProvider.getValue(p.type.getText())
      };
    });
  }

}
