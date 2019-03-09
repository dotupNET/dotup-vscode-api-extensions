// tslint:disable-next-line: no-implicit-dependencies
import { Disposable, TextEditor, TextEditorEdit } from 'vscode';

export class ThenablePromise<T> { // extends Promise<T> {
  promise: Promise<T>;

  constructor(ten: Thenable<T>) {
    // super((resolve, reject) => ten.then(resolve, reject));
    this.promise = new Promise<T>((resolve, reject) => ten.then(resolve, reject));
  }

  async await(): Promise<T> {
    return this.promise;
  }

}

// tslint:disable-next-line: no-any
export type registerCommandCallback = (...args: any[]) => any;
// tslint:disable-next-line: max-line-length : no-any
export type registerTextEditorCommandCallback = (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void;

export type ICommandHandler = IRegisterCommandHandler | IRegisterTextEditorCommandHandler;

export interface IRegisterCommandHandler {
  kind: 'IRegisterCommandHandler';
  commandName: string;
  // tslint:disable-next-line: no-any
  callback(...args: any[]): any;
}

// tslint:disable-next-line: no-any
export function isIRegisterCommandHandler<T>(object: any): object is IRegisterCommandHandler {
  // tslint:disable-next-line: no-unsafe-any
  return object.kind === 'IRegisterCommandHandler';
}

export interface IRegisterTextEditorCommandHandler {
  kind: 'IRegisterTextEditorCommandHandler';
  commandName: string;
  // callBack: registerTextEditorCommandCallback;
  // tslint:disable-next-line: no-any
  callback(textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]): void;
}
// tslint:disable-next-line: no-any
export function isIRegisterTextEditorCommandHandler<T>(object: any): object is IRegisterTextEditorCommandHandler {
  // tslint:disable-next-line: no-unsafe-any
  return object.kind === 'IRegisterTextEditorCommandHandler';
}