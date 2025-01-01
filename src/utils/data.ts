import * as fs from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

export function getUserDataDir(): string {
    const platform = process.platform;
    
    if (platform === "linux") {
        return `${process.env.HOME}/.config/osulzrulesetman/`;
    } else if (platform === "win32") {
        return `${process.env.APPDATA}/osulzrulesetman/`;
    } else {
        throw new Error("...?")
    }
}

function runCmd(cmd : string) {
    execSync(cmd, { cwd: getUserDataDir(), stdio: "inherit" });
}

export function initUserData() {
    const exampleRulesetbuild = fs.readFileSync(`src/examples/LLin.ts`, "utf8");
    if (!fs.existsSync(getUserDataDir())) fs.mkdirSync(getUserDataDir());
    runCmd(`cp ${resolve(process.cwd(), "src/Rulesetbuild.ts")} .`);
    runCmd(`pnpm add @types/node -D`);
    runCmd(`pnpm add log4js colors`);
    fs.mkdirSync(join(getUserDataDir(), "utils"));
    runCmd(`cp ${resolve(process.cwd(), "src/const.ts")} ./`,);
    runCmd(`cp ${resolve(process.cwd(), "src/utils/log.ts")} ./utils`,);
    runCmd(`cp ${resolve(process.cwd(), "src/utils/tempDir.ts")} ./utils`,);
    runCmd(`cp ${resolve(process.cwd(), "src/utils/colorization.ts")} ./utils`,);
    if (!fs.existsSync(join(getUserDataDir(), "rulesetbuilds"))) {
        fs.mkdirSync(join(getUserDataDir(), "rulesetbuilds"));
        fs.writeFileSync(join(getUserDataDir(), "rulesetbuilds/LLin.ts"), exampleRulesetbuild);
    }
}