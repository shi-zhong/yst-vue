interface ClassNameObject {
  [key: string]: ClassNameObject | boolean | string[]
}

const ClassNameArrayAddPrefix = (classList: string[], prefix: string): string[] => {
  return classList.map((item) => prefix + item)
}

const ClassNameObjectToList = (classNameObject: ClassNameObject, prefix: string): string[] => {
  let classNameList: string[] = []

  for (const [key, value] of Object.entries(classNameObject)) {
    if (typeof value === 'boolean') {
      if (value) {
        classNameList.push(key)
      }
    } else if (value instanceof Array) {
      classNameList = classNameList.concat(ClassNameArrayAddPrefix(value, key))
    } else if (value instanceof Object) {
      classNameList = classNameList.concat(ClassNameObjectToList(value as ClassNameObject, key))
    }
  }

  return ClassNameArrayAddPrefix(classNameList, prefix)
}

const ClassName = (
  classinfo: string[] | ClassNameObject | string | undefined,
  prefix?: string
): string => {
  let finalClassNames: string[] = []

  if (classinfo instanceof Array) {
    finalClassNames = finalClassNames.concat(ClassNameArrayAddPrefix(classinfo, prefix || ''))
  } else if (classinfo instanceof Object) {
    finalClassNames = finalClassNames.concat(ClassNameObjectToList(classinfo, prefix || ''))
  } else if (typeof classinfo === 'string') {
    finalClassNames.push(prefix + classinfo)
  } else {
    finalClassNames.push(prefix || '')
  }

  return finalClassNames.join(' ')
}

const ClassNameWithCSSModule = (
  Style: any,
  classinfo: string[] | ClassNameObject | string | undefined,
  prefix?: string
): string => {
  let finalClassNames: string[] = []

  if (classinfo instanceof Array) {
    finalClassNames = finalClassNames.concat(ClassNameArrayAddPrefix(classinfo, prefix || ''))
  } else if (classinfo instanceof Object) {
    finalClassNames = finalClassNames.concat(ClassNameObjectToList(classinfo, prefix || ''))
  } else if (typeof classinfo === 'string') {
    finalClassNames.push(prefix + classinfo)
  } else {
    finalClassNames.push(prefix || '')
  }

  return finalClassNames
    .map((item) => {
      const ret = Style[item]
      if (ret == undefined) {
        console.log(item + ' is not in', Style)
      }
      return ret
    })
    .join(' ')
}

const ClassNameFactor = (prefix?: string) => {
  return (classinfo?: string[] | ClassNameObject | string | undefined) =>
    ClassName(classinfo, prefix)
}

const ClassNameWithCSSModuleFactor = (cssModule: any, prefix?: string) => {
  return (classinfo?: string[] | ClassNameObject | string | undefined) =>
    ClassNameWithCSSModule(cssModule, classinfo, prefix)
}

export { ClassName, ClassNameWithCSSModule, ClassNameFactor, ClassNameWithCSSModuleFactor }
