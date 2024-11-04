export default async function slurp<T>(
  iterable: AsyncIterable<T>
): Promise<T[]> {
  const result: T[] = []
  for await (const item of iterable) result.push(item)
  return result
}
