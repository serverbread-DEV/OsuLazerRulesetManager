import { execSync } from 'child_process'
import logger from './utils/log'
import { getTempDir } from './utils/tempDir'
import { ok, info, processing, failed } from './utils/colorization'
import { existsSync } from 'node:fs'
import { resolve, join, isAbsolute } from 'path'
import osuPath from './utils/osuPath'

export class Rulesetbuild {
    readonly name: string = 'unknown'
    readonly description: string = 'unknown'
    readonly author: string = 'unknown'
    readonly version: string = 'unknown'
    protected tempDir = getTempDir() as string
    private cwd = `${this.tempDir}`
    /**
        用户需要继承这个类，并重写其中的构造方法和build()方法。
        其中build()方法用于准备ruleset必备的文件（如下载源代码并编译）并打包。
        build()方法生成的ruleset文件应该是个zip，其中包含必备的dll文件。
     */
    constructor() {
        if (this.name === 'unknown') return
    }

    /**
     * Gets a resource from a given address.
     * @param address The address of the resource. Can be a URL, a Git repository, or a local file.
     * @param type The type of the address.
     */
    protected getResource(address: string, type: 'url' | 'git' | 'file') {
        this.log(processing + `Getting resource from ${address} (${type})...`)
        this.cd(join(this.tempDir, this.name))
        let cmd = ''
        if (type === 'url') cmd = `curl -O ${address}`
        if (type === 'git') cmd = `git clone ${address}`
        if (type === 'file') cmd = `cp -r ${address} .`
        try {
            this.cmd(cmd)
            this.log(ok + `Finished`)
        } catch (e) {
            logger.error(failed + 'Error occurred, skipping...' + e)
        }
    }

    /**
     * Logs a message.
     * @param message The message to be logged.
     */
    protected log(message: string) {
        logger.log(info + `[Build Ruleset]${this.name} => ${message}`)
    }

    /**
     * Runs a command in the shell.
     * @param command The command to be run.
     * @returns The output of the command.
     */
    protected cmd(command: string) {
        this.log(`(shell)>$ ${command}`)
        return execSync(command, { cwd: this.cwd, stdio: 'inherit' })
    }

    protected cd(targetPath: string) {
        if (isAbsolute(targetPath)) {
            this.cwd = targetPath
        } else {
            this.cwd = resolve(this.cwd, targetPath)
        }
        if (!existsSync(this.cwd))
            throw new Error(`Unable to locate directory: ${this.cwd}`)

        this.log(`(cd)=> ${this.cwd}`)
        return
    }

    protected package(absolutePrefix: string, filename: string[]) {
        if (!isAbsolute(absolutePrefix))
            throw new Error(`not absolute: ${absolutePrefix}`)
        const outputFilename = `${this.name}-${this.version}.zip`
        const outputFilePath = resolve(this.tempDir, this.name, outputFilename)
        this.cd(absolutePrefix)

        const files = execSync(
            `ls ${filename.toString().replaceAll(',', ' ')}`,
            {
                cwd: this.cwd,
            },
        )
            .toString()
            .replaceAll('\n', ' ')

        try {
            this.cmd(`zip -ur ${outputFilePath} ${files}`)
        } catch (e) {
            logger.error(failed + 'Error occurred, skipping...' + e)
        }
        this.log(info + `Package: ${outputFilePath}`)
    }

    // TODO
    protected install() {
        this.log(`Installing ${this.name} to Osu...`)

        this.cd(resolve(this.tempDir, this.name))

        const osuRulesetPath = resolve(osuPath, 'rulesets')
        const outputFilename = `${this.name}-${this.version}.zip`
        const packagePath = resolve(
            resolve(this.tempDir, this.name, outputFilename),
        )

        this.cmd(`unzip -o ${packagePath} -d ${osuRulesetPath}`)
    }

    // Methods to be overridden
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public build() {}
}
