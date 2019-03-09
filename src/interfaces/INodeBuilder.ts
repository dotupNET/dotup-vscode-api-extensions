import { Node } from 'typescript';
import { ClassDescriptor } from '../descriptors/ClassDescriptor';
import { ExtendedNode } from './ExtendedNode';

export interface INodeBuilder {
  buildNodes(interfaceDescriptor: ClassDescriptor): Node[];
}
