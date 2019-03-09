import { getConstantValue } from 'typescript';
import { KeyValuePair } from 'dotup-ts-types';
export class IdentifierProvider {

  private names: KeyValuePair<string, number>[];

  constructor() {
    this.names = [];
  }

  getName(name: string): any {

    let entry = this.names.find(item => item.key === name);
    if (entry === undefined) {
      entry = { key: name, value: 0 };
      this.names.push(entry);
    }
    entry.value += 1;
    return `${name}${entry.value}`;
  }

}
