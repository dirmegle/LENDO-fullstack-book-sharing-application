export const fetchData = async (url: string) => {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    throw new Error('Failed to fetch books')
  }
}
