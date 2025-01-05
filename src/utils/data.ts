import * as fs from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'
import { platform } from 'os'

export function getUserDataDir(): string {
    if (platform() === 'linux') {
        return `${process.env.HOME}/.config/osulzrulesetman/`
    } else if (platform() === 'win32') {
        return `${process.env.APPDATA}/osulzrulesetman/`
    } else {
        throw new Error('...?')
    }
}

function runCmd(cmd: string) {
    execSync(cmd, { cwd: process.cwd(), stdio: 'inherit' })
}

export function initUserData() {
    if (fs.existsSync(getUserDataDir())) return
    fs.mkdirSync(getUserDataDir())
    fs.mkdirSync(join(getUserDataDir(), 'utils'))
    const rulesetbuildDir = resolve(getUserDataDir(), 'rulesetbuilds/')
    runCmd(`mkdir -p ${rulesetbuildDir}`)
    runCmd('pwd')
    runCmd(
        `cp utils/loadLocalModule.ts ${resolve(getUserDataDir(), 'utils/')}`,
    )
    runCmd(`cp examples/LLin.ts ${rulesetbuildDir}`)
    runCmd(`cp examples/Typer.ts ${rulesetbuildDir}`)
}
