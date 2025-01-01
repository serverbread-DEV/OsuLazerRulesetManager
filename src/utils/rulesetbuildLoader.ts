import * as fs from "fs";
import {execSync} from "child_process";
import { resolve } from "path";
import {getUserDataDir} from "./data";
import logger from "./log";
import {Rulesetbuild} from "../Rulesetbuild";
import { failed, ok } from  "./colorization";

const logPrefix = "[RulesetbuildLoader]";

const rulesetbuildsDir = resolve(getUserDataDir() as string, "rulesetbuilds");

function checkRulesetbuilds(rulesetbuilPath: string) {
    const filename = rulesetbuilPath.split("/").pop();
    const code = `class ${filename?.split(".")[0]} `;

    const content = fs.readFileSync(rulesetbuilPath, "utf-8");

    if (!content.includes(code)) return false;

    return true;
}

export async function importRulesetbuilds() {
    let rulesetbuildsObjectsList: { [key: string]: Rulesetbuild } = {};
    let rulesetbuildsList = execSync(`ls ${rulesetbuildsDir}`).toString().trim().split(" ");

    if (rulesetbuildsList[0].length === 0) {
        rulesetbuildsList = [];
    }

    for (const rulesetbuild of rulesetbuildsList) {
        const rulesetbuildsPath = resolve(rulesetbuildsDir, rulesetbuild);

        if (!checkRulesetbuilds(rulesetbuildsPath)) {
            logger.warn(logPrefix + failed + `Invalid rulesetbuilds: ${rulesetbuildsPath}`);
            continue;
        }

        const RulesetbuildClass: any = (await import(rulesetbuildsPath)).default;

        rulesetbuildsObjectsList[rulesetbuild.split('.')[0]] = new RulesetbuildClass()
        logger.log(logPrefix + ok + `Rulesetbuilds ${rulesetbuild} loaded`);
    }

    logger.log(logPrefix + ok + `All rulesetbuilds loaded successfully`);
    return rulesetbuildsObjectsList;
}
