// tslint:disable: newline-per-chained-call
// tslint:disable-next-line: no-implicit-dependencies
import { expect } from 'chai';
import { SourceFileWriter } from '../src/SourceFileWriter';

describe('AwesomeLibrary', () => {

  it('should create an instance', () => {
    const value = new SourceFileWriter();
    expect(value).instanceOf(SourceFileWriter);
  });

});
