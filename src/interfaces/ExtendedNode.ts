import { Node } from 'typescript';

// tslint:disable-next-line: interface-name
export interface ExtendedNode extends Node {
  jsDoc?: Node[];
}
