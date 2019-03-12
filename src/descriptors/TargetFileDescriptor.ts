import { ExtendedNode } from '../interfaces/ExtendedNode';

export class TargetFileDescriptor {
  // source
  readonly targetFilePath: string;
  // importClause?: Node[];

  // TODO: Remove
  nodes: ExtendedNode[];

  constructor(targetFilePath: string) {
    // source
    this.targetFilePath = targetFilePath;
    this.nodes = [];
  }

  isTargetValid(): boolean {
    if (this.targetFilePath === undefined || this.targetFilePath.length < 1) {
      return false;
    }
    if (this.nodes === undefined || this.nodes.length < 1) {
      return false;
    }

    return true;
  }

}
