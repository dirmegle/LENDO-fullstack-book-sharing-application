export const testUndefinedFields = <T>(
  typeKeys: (keyof T)[],
  fieldsToOmit: (keyof T)[],
  fakeInput: (overrides: Partial<T>) => T,
  testedMethod: (input: T) => Promise<any>
) => {
  const keys = typeKeys.filter((key) => !fieldsToOmit.includes(key))
  keys.forEach(async (key) => {
    const input = fakeInput({ [key]: undefined } as Partial<T>)
    await expect(testedMethod(input)).rejects.toThrow(
      new RegExp(key as string, 'i')
    )
  })
}

export const testMissingFields = (
  typeKeys: string[],
  fieldsToOmit: string[],
  fakeInput: (overrides: Partial<any>) => any,
  testedMethod: (input: any) => Promise<any>
) => {
  const keys = typeKeys.filter((key) => !fieldsToOmit.includes(key))

  keys.forEach(async (key) => {
    const { [key]: omittedField, ...inputWithoutKey } = fakeInput({})

    await expect(testedMethod(inputWithoutKey)).rejects.toThrow(
      new RegExp(key, 'i')
    )
  })
}
