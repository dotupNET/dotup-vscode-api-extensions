// tslint:disable: non-literal-fs-path
import * as fs from 'fs';
import { TargetFileDescriptor } from './descriptors/TargetFileDescriptor';
import { SourceFileGenerator } from './generators/SourceFileGenerator';

export class SourceFileWriter {
  write(targetDescriptor: TargetFileDescriptor): void {
    if (!fs.existsSync(targetDescriptor.targetFilePath)) {
      // Create new interface file
      fs.closeSync(fs.openSync(targetDescriptor.targetFilePath, 'w'));
    }

    // Create  file
    const sourceFileGenerator = new SourceFileGenerator();
    const targetSourceFile = sourceFileGenerator.createFile(targetDescriptor);

    fs.writeFileSync(targetDescriptor.targetFilePath, targetSourceFile.text);
  }

}
