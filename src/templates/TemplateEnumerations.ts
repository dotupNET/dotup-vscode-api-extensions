export enum TemplateType {
  file = 'file',
  class = 'class',
  method = 'method',
  asyncMethod = 'asyncMethod',
  function = 'function',
  asyncFunction = 'asyncFunction',
  property = 'property',
  ImportStatement = ''
}

export enum TemplatePlaceHolder {
  Imports = 'Imports',
  FileTests = 'FileTests',
  ClassTests = 'ClassTests',
  MemberTests = 'MemberTests',
  Declarations = 'Declarations',
  MethodCallResult = 'MethodCallResult',
  PropertyGetResult = 'PropertyGetResult',
  PropertySetVariable = 'PropertySetVariable',

  FileName = 'FileName',
  ClassName = 'ClassName',
  MethodName = 'MethodName'
}
