import * as fs from "fs";
import { resolve } from "path";

export function getTempDir() {
    const platform = process.platform;

    if (platform === "linux") {
        const tmpDir = process.env["TMPDIR"];
        return resolve(tmpDir ? tmpDir : "/tmp", "osulzrulesetman");
    }
}

if (!fs.existsSync(getTempDir() as string)) {
    fs.mkdirSync(getTempDir() as string);
}