// tslint:disable: non-literal-fs-path
import * as fs from 'fs';
import * as path from 'path';
// tslint:disable-next-line: no-require-imports
import mkdirp = require('mkdirp');
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

  writeString(targetDescriptor: TargetFileDescriptor, fileContent: string): void {
    if (!fs.existsSync(targetDescriptor.targetFilePath)) {
      // Create directory if missing
      const dir = path.dirname(targetDescriptor.targetFilePath);
      if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
      }

      // Create new interface file
      fs.closeSync(fs.openSync(targetDescriptor.targetFilePath, 'w'));
    }

    // Create  file
    fs.writeFileSync(targetDescriptor.targetFilePath, fileContent);
  }

}
