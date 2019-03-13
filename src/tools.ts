import * as path from 'path';

export namespace tools {

  export function camelCase(value: string): string {
    return value
      .charAt(0)
      .toLowerCase() + value.substr(1);
  }

  export function getCurrentIsoDate(): string {
    const dt = new Date(Date.now()).toISOString();

    // remove T and everything after dot
    return dt.replace(/T|\..+/g, ' ');
  }
  /*
          // Remove everything from src
          const regeAfter = /(\/src|\\src\b)(?!.*\1).+/g;

          // Remove everything till src
          const regeTill = /.+(\/src|\\src\b)(?!.*\1)/g;
   */
  export function getRelativePath(sourceFilePath: string, targetFilePath: string): string {
    const sourceDir = path.normalize(path.dirname(sourceFilePath));
    const targetDir = path.normalize(path.dirname(targetFilePath));

    return path.relative(targetDir, sourceDir);
  }

  export function join(...args: string[]): string { return path.join(...args); }

  export function removeQuotemark(value: string) {
    return value.replace(/"|'/gm, '');
  }

  export function setQuotemark(value: string, quotemark: string = '\'') {
    return value.replace(/"|'/gm, quotemark);
  }

  export function normalizePath(value: string): string { return value.replace(/\\/g, '/'); }

  export function dirname(value: string): string {
    return path.dirname(value);
  }

  export function basename(value: string, ext?: string): string {
    return path.basename(value, ext);
  }

  export function createImportStatements(sourceFilePath: string, targetFilePath: string, identifier: string, template: string[]): string {
    const sourceDir = path.normalize(path.dirname(sourceFilePath));
    const targetDir = path.normalize(path.dirname(targetFilePath));
    const sourceFileName = path.basename(sourceFilePath, '.ts');
    let importPath: string = path.relative(targetDir, sourceDir);

    importPath = path
      .join(importPath, sourceFileName)
      .replace(/\\/g, '/');

    if (!importPath.startsWith('.')) {
      importPath = `./${importPath}`;
    }

    // const sourceFileDir = path.dirname(sourceFilePath);
    // const testFileDir = path.dirname(testFilePathFromProjectRoot);

    // const importPath = path.join(path.relative(testFileDir, sourceFileDir), identifier);

    return template.join('\n')
      .replace(/\$\{moduleName\}/g, `${identifier}`)
      .replace(/\$\{modulePath\}/g, `${importPath}`);
  }
  // export function join<T>(nodes: T[], separator: T | (() => T)): T[] {
  //   const result: T[] = [];
  //   for (let index = 0; index < nodes.length; index += 1) {
  //     result.push(nodes[index]);
  //     if (index < (nodes.length - 1)) {
  //       if (typeof separator === 'function') {
  //         result.push(separator());
  //       } else {
  //         result.push(separator);
  //       }
  //     }
  //   }
  //   return result;
  // }

}
