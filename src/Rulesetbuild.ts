import { execSync } from "child_process";
import logger from "./utils/log";
import { getTempDir } from "./utils/tempDir";
import {ok, info, processing, failed} from "./utils/colorization"
import { existsSync } from "node:fs";
import { resolve, join, relative, isAbsolute } from "path";

export class Rulesetbuild {
    readonly name: string = "unknown";
    readonly description: string = "unknown";
    readonly author: string = "unknown";
    readonly version: string = "unknown";
    protected tempDir = getTempDir() as string;
    private cwd = `${this.tempDir}`;
    /**
        用户需要继承这个类，并重写其中的构造方法和build()方法。
        其中build()方法用于准备ruleset必备的文件（如下载源代码并编译）并打包。
        build()方法生成的ruleset文件应该是个zip，其中包含必备的dll文件。
     */
    constructor() {
        if (this.name === "unknown") return;
    }

    /**
     * Gets a resource from a given address.
     * @param address The address of the resource. Can be a URL, a Git repository, or a local file.
     * @param type The type of the address.
     */
    protected getResource(address: string, type: "url" | "git" | "file") {
        this.log(processing + `Getting resource from ${address} (${type})...`);
        let cmd: string = "";
        if (type === "url") cmd = `curl -O ${address}`;
        if (type === "git") cmd = `git clone ${address}`;
        if (type === "file") cmd = `cp -r ${address} .`;
        try {
            this.cmd(cmd);
            this.log(ok + `Finished`);
        } catch (e) {
            logger.error(failed + "Error occurred, skipping...");
        }
    }

    /**
     * Logs a message.
     * @param message The message to be logged.
     */
    protected log(message: string) {
        logger.log(info + `[Build Ruleset]${this.name} => ${message}`);
    }

    /**
     * Runs a command in the shell.
     * @param command The command to be run.
     * @returns The output of the command.
     */
    protected cmd(command: string) {
        this.log(`(shell)${this.cwd}>$ ${command}`);
        return execSync(command, { cwd: this.cwd, stdio: "inherit" })
    }

    protected cd(targetPath: string) {
        if (isAbsolute(targetPath)) {
            this.cwd = targetPath;
        } else {
            this.cwd = resolve(this.cwd, targetPath);
        }
        if (!existsSync(this.cwd)) throw new Error(`Unable to locate directory: ${this.cwd}`);

        this.log(`(cd)=> ${this.cwd}`);
        return
    }

    protected package(absolutePrefix: string, filename: string[]) {
        if (!isAbsolute(absolutePrefix)) throw new Error(`not absolute: ${absolutePrefix}`);
        const outputFilename = `${this.name}-${this.version}.zip`;
        const outputFilePath = resolve(this.tempDir, this.name, outputFilename);
        this.cd(absolutePrefix);

        const files = execSync(`ls ${filename.toString().replaceAll(",", " ")}`, { cwd: this.cwd })
                            .toString().replaceAll("\n", " ");

        try {
            this.cmd(`zip -ur ${outputFilePath} ${files}`);
        } catch (e) {
            logger.error(failed + "Error occurred, skipping...");
        }
        this.log(info + `Package: ${outputFilePath}`);
    }

    // Methods to be overridden
    public build() {}
}
