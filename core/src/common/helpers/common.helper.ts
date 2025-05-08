export const wait = async (msec: number) => new Promise<true>(res => setTimeout(() => res(true), msec))
export const isNull = <T>(v: T) => v == undefined || v == null
export const isNotNull = <T>(v: T) => !isNull(v)
export const arrFromEnd = <T>(arr: T[], i: number): T => arr[arr.length - 1 - i]
export const toPascalCase = (str: string): string => str.replace(/(\w)(\w*)/g, (_,g1,g2) => g1.toUpperCase() + g2.toLowerCase());
export const toBatches = <T>(arr: T[], batchSize: number): T[][] => {
    const batches: T[][] = []
    for (let i = 0; i < arr.length; i += batchSize) {
        batches.push(arr.slice(i, i + batchSize))
    }
    return batches
}
