import { execSync } from 'child_process';
import logger from './log';
import { processing } from "./colorization";
import { supportedPlatforms } from "../const";

export const checkCmds:{[key: string]: string} = {
    curl: 'curl --version',
    dotnetsdk: 'dotnet --list-sdks',
    // debug1: "wdnmd114514",
    git: 'git --version',
    zip: 'zip --version',
    // debug2: "wdnmd1919810"
}

export function checkEnv() {
    const result: { [key: string]: string | null } = {};

    for (const key in checkCmds) {
        try {
            const commandResult = execSync(checkCmds[key]);
            logger.debug(processing + `Checking ${key}...\n${commandResult.toString().trim()}`);
            result[key] = commandResult.toString();
        } catch (e) {
            logger.error(e);
            result[key] = null;
        }
    }

    return result;
}

export function checkPlatform() {
    const platform = process.platform;
    return supportedPlatforms.includes(platform);
}