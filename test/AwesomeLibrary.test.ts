// tslint:disable: newline-per-chained-call
// tslint:disable-next-line: no-implicit-dependencies
import { expect } from 'chai';
import { AwesomeLibrary } from '../src/AwesomeLibrary';

describe('AwesomeLibrary', () => {

  it('should create an instance', () => {
    const value = new AwesomeLibrary();
    expect(value).instanceOf(AwesomeLibrary);
  });

});
