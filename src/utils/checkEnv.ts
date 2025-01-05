import { execSync } from 'child_process'
import logger from './log'
import { platform } from 'os'
import { processing } from './colorization'
import { supportedPlatforms } from '../const'

export const checkCmds: Record<string, string> = {
    curl: 'curl --version',
    dotnetsdk: 'dotnet --list-sdks',
    // debug1: "wdnmd114514",
    git: 'git --version',
    zip: 'zip --version',
    unzip: 'unzip -v',
    // debug2: "wdnmd1919810"
}

export function checkEnv() {
    const result: Record<string, string | null> = {}

    for (const key in checkCmds) {
        try {
            const commandResult = execSync(checkCmds[key])
            logger.debug(
                processing +
                    `Checking ${key}...\n${commandResult.toString().trim()}`,
            )
            result[key] = commandResult.toString()
        } catch (e) {
            logger.error(e)
            result[key] = null
        }
    }

    return result
}

export function checkPlatform() {
    return supportedPlatforms.includes(platform())
}
