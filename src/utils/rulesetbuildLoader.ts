import * as fs from 'fs';
import { execSync } from 'child_process';
import { resolve, extname, basename } from 'path';
import { getUserDataDir } from './data';
import logger from './log';
import { Rulesetbuild } from '../Rulesetbuild';
import { failed, ok, info, processing } from './colorization';
import { runningMode } from './checkEnv';

const logPrefix = '[RulesetbuildLoader]';

const rulesetbuildsDir = resolve(getUserDataDir() as string, 'rulesetbuilds');

function checkRulesetbuilds(rulesetbuilPath: string) {
    const filename = rulesetbuilPath.split('/').pop();
    const code = `class ${filename?.split('.')[0]} `;

    const content = fs.readFileSync(rulesetbuilPath, 'utf-8');

    return content.includes(code);
}

export async function importRulesetbuilds() {
    const rulesetbuildsObjectsList: Record<string, Rulesetbuild> = {};
    let rulesetbuildsList = execSync(`ls ${rulesetbuildsDir}`)
        .toString()
        .trim()
        .split('\n');

    if (rulesetbuildsList[0].length === 0) {
        rulesetbuildsList = [];
    }

    for (const i in rulesetbuildsList) {
        const rulesetbuild = rulesetbuildsList[i];
        const rulesetbuildsPath = resolve(rulesetbuildsDir, rulesetbuild);

        // runtime compile
        if (extname(rulesetbuildsPath) === runningMode) {
            // check filename == class name?
            if (!checkRulesetbuilds(rulesetbuildsPath)) {
                logger.warn(
                    logPrefix +
                        failed +
                        `Invalid rulesetbuilds: ${rulesetbuildsPath}`,
                );
                continue;
            }
        } else if (extname(rulesetbuildsPath) === '.ts') {
            logger.log(processing + `Compiling ${basename(rulesetbuildsPath)}`);
            execSync(
                `npx tsc --target ES2021 --module CommonJS ./${basename(rulesetbuildsPath)}`,
                {
                    cwd: resolve(getUserDataDir(), 'rulesetbuilds'),
                    stdio: 'inherit',
                },
            );
            execSync(
                `mv ./${basename(rulesetbuildsPath)} ${basename(rulesetbuildsPath)}.old`,
                {
                    cwd: resolve(getUserDataDir(), 'rulesetbuilds'),
                },
            );
            logger.log(
                ok + `Rulesetbuild ${basename(rulesetbuildsPath)} compiled.`,
            );
            logger.warn(info + `Please restart to apply changes.`);
            continue;
        } else continue;

        const RulesetbuildClass = await (
            await import(rulesetbuildsPath)
        ).default;

        rulesetbuildsObjectsList[rulesetbuild.split('.')[0]] =
            new RulesetbuildClass();
        logger.log(logPrefix + ok + `Rulesetbuilds ${rulesetbuild} loaded`);
    }

    logger.log(logPrefix + ok + `All rulesetbuilds loaded successfully`);
    return rulesetbuildsObjectsList;
}
