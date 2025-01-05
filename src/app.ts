import { processing, ok, failed, ask } from './utils/colorization'
import logger from './utils/log'
import { checkEnv, checkPlatform } from './utils/checkEnv'
import { supportedPlatforms } from './const'
import { printMotd } from './utils/motd'
import { createInterface } from 'readline'
import { initUserData } from './utils/data'
import { resolveRulesetbuild } from './utils/rulesetbuildResolver'
import osuPath from './utils/osuPath'

printMotd()

logger.log(processing + 'Initializing...')

initUserData()

logger.log(ok + 'Initialed')

logger.log(processing + 'Checking Environment For Build Ruleset DLL...')

if (!checkPlatform()) {
    logger.error(
        failed +
            `Platform check failed: ${process.platform} platform not supported`,
    )
    logger.error(`Supported platforms:${supportedPlatforms}`)
    process.exit(1)
}

const checkEnvResult = checkEnv()
let checkEnvResultFailedFlag = false
for (const output in checkEnvResult) {
    if (!checkEnvResult[output]) {
        logger.error(failed + `Environment check failed: ${output}`)
        checkEnvResultFailedFlag = true
    }
}
if (checkEnvResultFailedFlag) process.exit(1)

logger.log(ok + 'All Checks Passed!')

logger.log(processing + 'Loading rulesetbuilds...')

resolveRulesetbuild().then((rulesetbuildsList) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    logger.log(
        ask +
            `Which ruleset do you want to install to OSU!Lazer(${osuPath})?(input answer below):`,
    )
    rl.on('history', (history) => {
        if (!rulesetbuildsList[history[0]]) {
            rl.write(` <== Unknown rulesetbuild, please try again`)
        } else {
            rl.close()
            console.log('\n')
            logger.log(processing + 'Start Rulesetbuild...')
            const rulesetbuild = rulesetbuildsList[history[0]]
            rulesetbuild.build()
            logger.log(ok + 'Build Successfully!')
            rulesetbuild.install()
            logger.log(ok + 'Ruleset Installed')
        }
    })
})
