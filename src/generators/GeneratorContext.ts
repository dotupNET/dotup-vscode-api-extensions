// tslint:disable-next-line: no-implicit-dependencies
import { Node } from 'typescript';
import { SourceFileDescriptor } from '../descriptors/SourceFileDescriptor';
import { TargetFileDescriptor } from '../descriptors/TargetFileDescriptor';
import { NodeBuilder } from './NodeBuilder';

export class GeneratorContext {
  // classDescriptor: ClassDescriptor;

  readonly sourceDescriptor: SourceFileDescriptor;
  targetDescriptor: TargetFileDescriptor;

  constructor(source: string | SourceFileDescriptor, target?: string | TargetFileDescriptor) {
    // this.builder = new NodeBuilder();
    if (source instanceof SourceFileDescriptor) {
      this.sourceDescriptor = source;
    } else {
      this.sourceDescriptor = new SourceFileDescriptor(source);
    }
    if (target !== undefined) {
      if (target instanceof TargetFileDescriptor) {
        this.targetDescriptor = target;
      } else {
        this.targetDescriptor = new TargetFileDescriptor(target);
      }
    }
  }

  // getNodes(): Node[] {
  //   return this.builder.nodes;
  // }

}
