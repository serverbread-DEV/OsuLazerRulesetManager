# OSU!Lazer Ruleset Manager

这是一个适用于 osu!lazer 的 rulesets 管理器。

## 如何使用

当 OSU!Lazer Ruleset Manager 第一次启动时，会在 `~/.config/osulzrulesertman/` 目录初始化。

以下文件将会被创建：

```text
~/.config/osulzrulesetman/
~/.config/osulzrulesetman/rulesetbuilds/
~/.config/osulzrulesetman/config.json
```

OSU Lazer Ruleset Manager 通过存放在`rulesetbuilds`目录的ts文件（我们把它叫做`rulesetbuilds`文件）来描述一个Ruleset, 其中应当包含以下信息：

- 必备资源（github source code, etc.）
- 源代码的编译，构建方法
- 需要打包的文件

[这里](src/examples/LLin.ts)有一个示例的 rulesetbuilds，你可以根据改写成你自己的 rulesetbuilds。
