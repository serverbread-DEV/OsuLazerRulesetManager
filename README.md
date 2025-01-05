# OSU Lazer Ruleset Manager

这是一个适用于 [osu lazer](https://github.com/ppy/osu) 的 rulesets 管理器。

**注意**，这个项目还没有完工，以下是将来（可能）会加入的功能：

- [ ] 中心仓库，可下载/上传 Rulesetbuilds 文件
- [ ] 本体更新检查
- [ ] Ruleset 更新检查
- [ ] 多平台支持
- [X] CI

## 如何使用

当 OSU Lazer Ruleset Manager 第一次启动时，会在 `~/.config/osulzrulesetman/` 目录初始化。

以下文件将会被创建：

```text
~/.config/osulzrulesetman/
~/.config/osulzrulesetman/rulesetbuilds/
~/.config/osulzrulesetman/utils/
~/.config/osulzrulesetman/utils/loadLocalModule.ts
```

其中`~/.config/osulzrulesetman/rulesetbuilds/`这个目录比较特殊

OSU Lazer Ruleset Manager 通过存放在`rulesetbuilds`目录的ts文件（我们把它叫做`rulesetbuilds`文件）来描述一个Ruleset, 其中应当包含以下信息：

- 必备资源（github source code, etc.）
- 源代码的编译，构建方法
- 需要打包的文件

[这里](src/examples/LLin.ts)有一个示例的 rulesetbuilds。经过测试能正常运行。
