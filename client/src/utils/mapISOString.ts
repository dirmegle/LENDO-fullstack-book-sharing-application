/* eslint-disable @typescript-eslint/no-explicit-any */
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