import { importRulesetbuilds } from './rulesetbuildLoader';
// import { RulesetInfo } from "../types/rulesetInfo";
import logger from './log';
import { info } from './colorization';

// const logPrefix = "[RulesetbuildResolver]"
const logPrefix = '';

export async function resolveRulesetbuild() {
    const rulesetbuildsList = await importRulesetbuilds();
    logger.log(logPrefix + info + 'Available Rulesets List:');
    for (const rulesetbuildName in rulesetbuildsList) {
        // const rulesetbuildObject = rulesetbuildsList[rulesetbuildName];
        console.log(rulesetbuildName);
        // let rulesetInfo: RulesetInfo = {
        //     name: rulesetbuildObject.name,
        //     description: rulesetbuildObject.description,
        //     author: rulesetbuildObject.author,
        //     version: rulesetbuildObject.version
        // };
        // // rulesetbuildObject.build();
        // logger.debug(rulesetInfo);
    }
    return rulesetbuildsList;
}
