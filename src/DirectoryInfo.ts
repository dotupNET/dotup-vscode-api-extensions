
export class DirectoryInfo {
  // Source
  sourceDirectoryName: string;
  sourcePath: string;
  sourceFilePath: string;
  // Target
  targetDirectoryName: string;
  targetPath: string;
  targetFilePath: string;

  rootPath: string;

  // Relative
  relativeFromSourceToRoot: string;
  relativeFromTargetToRoot: string;
}
