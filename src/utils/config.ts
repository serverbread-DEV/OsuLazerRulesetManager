
import * as fs from "fs";
import { getUserDataDir } from "./data";


const defaultUserConfig = {
    
}

// export function initUserConfig() {
//     const configFileDir = getUserDataDir() as string;
//
//     if (!fs.existsSync(configFileDir)) fs.mkdirSync(configFileDir);
//
//     const configPath = `${configFileDir}/config.json`;
//
//     if (!fs.existsSync(configPath)) {
//         fs.writeFileSync(configPath, JSON.stringify(defaultUserConfig));
//     }
// }
//
// export function loadUserConfig() {
//     const configsDir = getUserDataDir() as string;
//     const configPath = `${configsDir}/config.json`;
//
//     const config = fs.readFileSync(configPath, "utf-8");
//
//     return JSON.parse(config);
// }