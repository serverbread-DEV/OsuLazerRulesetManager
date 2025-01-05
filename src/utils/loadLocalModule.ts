import { join } from "path";

export async function loadLocalModule(moduleName: string) {
    console.debug(`Loading Local Module ${moduleName}...`);
    return await import(`${join(process.cwd(), "src", moduleName)}`);
}