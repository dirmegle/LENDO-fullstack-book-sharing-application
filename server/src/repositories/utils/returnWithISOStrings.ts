export const mapISOStringSingleObject = (
  object: Record<string, any>,
  keys: string[]
) => ({
  ...object,
  ...keys.reduce(
    (acc, key) => {
      if (object[key] instanceof Date) {
        acc[key] = object[key].toISOString()
      }
      return acc
    },
    {} as Record<string, any>
  ),
})

export const mapISOStringObjectArray = (
  objects: Record<string, any>[],
  keys: string[]
) =>
  objects.map((object) => ({
    ...object,
    ...keys.reduce(
      (acc, key) => {
        if (object[key] instanceof Date) {
          acc[key] = object[key].toISOString()
        }
        return acc
      },
      {} as Record<string, any>
    ),
  }))
