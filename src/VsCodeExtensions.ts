// tslint:disable-next-line: no-implicit-dependencies
import { commands, ExtensionContext } from 'vscode';
// tslint:disable-next-line: max-line-length
import { ICommandHandler, IRegisterCommandHandler, IRegisterTextEditorCommandHandler, isIRegisterCommandHandler, isIRegisterTextEditorCommandHandler } from './types';

export class VsCodeExtensions {
  protected readonly context: ExtensionContext;
  protected readonly handler: ICommandHandler[];
  constructor(context: ExtensionContext) {
    this.context = context;
    this.handler = [];
  }

  addCommand(handler: IRegisterCommandHandler): void;
  // tslint:disable-next-line: unified-signatures
  addCommand(handler: IRegisterTextEditorCommandHandler): void;
  addCommand(handler: ICommandHandler): void {
    this.handler.push(handler);
  }

  registerCommands(): void {
    this.handler.forEach(command => {
      if (isIRegisterCommandHandler(command)) {
        const rc = commands.registerCommand(command.commandName, command.callback, command);
        this.context.subscriptions.push(rc);
      } else if (isIRegisterTextEditorCommandHandler(command)) {
        const rtec = commands.registerTextEditorCommand(command.commandName, command.callback, command);
        this.context.subscriptions.push(rtec);
      } else {
        throw new Error('kind not defined. If you\'re using a class, set kind in constructor.');
      }
    });
  }
}
