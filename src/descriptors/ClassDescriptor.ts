// tslint:disable-next-line: max-line-length
import { ClassLikeDeclarationBase, ConstructorDeclaration, HeritageClause, MethodSignature, Modifier, Node, PropertySignature, TypeElement, TypeParameterDeclaration } from 'typescript';

export class ClassDescriptor {
  methods: MethodSignature[];
  properties: PropertySignature[];
  modifiers: Modifier[];
  readonly className: string;
  typeParameters: TypeParameterDeclaration[];
  heritageClauses: HeritageClause[];
  classDeclarationString: string;
  jsDoc: Node[];
  classDeclaration: ClassLikeDeclarationBase;
  ctors: ConstructorDeclaration[];
  get interfaceName(): string {
    return `I${this.className}`;
  }

  constructor(className: string) {
    this.className = className;
  }

  getMembersAsNode(): Node[] {
    return (<Node[]>this.properties).concat(this.methods);
  }

  getPropertiesAsNode(): Node[] {
    return (<Node[]>this.properties);
  }

  getMethodsAsNode(): Node[] {
    return (<Node[]>this.methods);
  }

  getMembersAsTypeElement(): ReadonlyArray<TypeElement> {
    return (<TypeElement[]>this.properties).concat(this.methods);
  }
}
