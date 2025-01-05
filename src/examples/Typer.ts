// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { loadLocalModule } from '../utils/loadLocalModule'
import { resolve } from 'path'

export default (async () => {
    const Rulesetbuild = (await loadLocalModule('Rulesetbuild')).Rulesetbuild

    class Typer extends Rulesetbuild {
        override name = 'Typer'
        override description = 'No description, website, or topics provided. '
        override author = 'peppy'
        override version = 'git-repo-latest'

        constructor() {
            super()
            this.cmd(`mkdir -p ${this.tempDir}/${this.name}`)
            this.cd(resolve(this.tempDir, this.name))
        }

        override build() {
            this.getResource('git@github.com:peppy/ruleset-typer.git', 'git')
            this.cd('ruleset-typer/osu.Game.Rulesets.Typer')
            this.cmd('dotnet build')

            const artifactsDir = resolve(
                this.tempDir,
                this.name,
                'ruleset-typer',
                'osu.Game.Rulesets.Typer/bin/Debug/net8.0/',
            )
            const fileList = [
                'osu.Game.Rulesets.Typer.dll',
                'osu.Game.Rulesets.Typer.pdb',
            ]
            this.package(artifactsDir, fileList)
            this.install()
        }
    }
    return Typer
})()
