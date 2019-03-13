export enum TemplateType {
  file,
  class,
  method,
  function,
  property,
  ImportStatement
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
