import { getConstantValue } from 'typescript';

export class ValueProvider {

  // tslint:disable-next-line: no-any
  // static [Symbol.match](x: any) {
  //   return x instanceof this;
  // }
  // tslint:disable-next-line: no-any
  getValue(dataType: string): any {

    switch (dataType) {

      case 'number':
      case 'bigint':
        return 10;

      case 'string':
        // tslint:disable-next-line: quotemark
        return "'Oha'";

    }

    return undefined;
  }
}
