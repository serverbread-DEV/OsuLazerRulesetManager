// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { loadLocalModule } from '../utils/loadLocalModule';
import { resolve } from 'path';

export default (async () => {
    const Rulesetbuild = (await loadLocalModule('Rulesetbuild')).Rulesetbuild;

    // 仿照ABS的Rulesetbuild配置
    class LLin extends Rulesetbuild {
        // Ruleset 的基本信息
        override name = 'LLin';
        override description =
            ' 从mfosu中分离出来的下载加速 & 游戏内音乐播放器';
        override author = 'MATRIX-feather';
        override version = 'git-repo-latest';

        // 在构造函数中设置目录
        constructor() {
            super();
            this.cmd(`mkdir -p ${this.tempDir}/${this.name}`);
            this.cd(resolve(this.tempDir, this.name));
        }

        // 重写build()方法，在其中进行dll的编译，打包等。
        override build() {
            // Rulesetbuild#log()：推荐使用此方法打印日志。
            // Rulesetbuild#getResource()：从网络或本地准备资源文件，详细请查看方法定义。
            this.getResource('git@github.com:MATRIX-feather/LLin.git', 'git');
            // Rulesetbuild#cd(): 用此方法改变目录
            this.cd('LLin');
            // Rulesetbuild#cmd(): 在shell里执行一条命令
            this.cmd('dotnet restore IGPlayerLoader');
            this.cmd(
                'dotnet publish IGPlayerLoader -c Release /p:WarningLevel=0',
            );
            // Artifacts saved in IGPlayerLoader/bin/Release/net8.0/publish/
            // Rulesetbuild#package()：将构建产物打包。
            const artifactsDir = resolve(
                this.tempDir,
                this.name,
                'LLin',
                'IGPlayerLoader/bin/Release/net8.0/publish/',
            );
            const fileList = [
                'M.*.dll',
                '*/M.*.dll',
                'osu.Game.Rulesets.*.dll',
                'Tmds.*.dll',
            ];
            this.package(artifactsDir, fileList);
        }
    }
    return LLin;
})();
