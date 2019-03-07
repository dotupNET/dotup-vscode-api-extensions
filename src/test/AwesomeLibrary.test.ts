//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
// import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';
import expect from 'expect';
import { AwesomeLibrary } from '../AwesomeLibrary';
// Defines a Mocha test suite to group tests of similar kind together

describe("AwesomeLibrary Tests", function () {

  // Defines a Mocha unit test
  it("ctor test", function () {
    const lib = new AwesomeLibrary();
    expect(lib instanceof AwesomeLibrary).toBeTruthy();
  });

});