import { join } from 'path'

export async function loadLocalModule(moduleName: string) {
    return await import(`${join(process.cwd(), moduleName)}`)
}
