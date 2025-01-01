import * as fs from "fs";
import { execSync } from "child_process";
import * as path from "path";
import { info } from "./colorization";
import logger from "./log";

let osuPath: string;

if (process.platform === "linux") {
    osuPath = "~/.local/share/osu/";
} else {
    osuPath = "¯\\_(ツ)_/¯ IDK";
}

logger.log(info + "OSU Directory: ", osuPath);

export default osuPath;
