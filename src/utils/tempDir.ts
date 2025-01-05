import * as fs from "fs";
import { platform } from "os";
import { resolve } from "path";

export function getTempDir() {
    if (platform() === "linux") {
        const tmpDir = process.env["TMPDIR"];
        return resolve(tmpDir ? tmpDir : "/tmp", "osulzrulesetman");
    }
}

if (!fs.existsSync(getTempDir() as string)) {
    fs.mkdirSync(getTempDir() as string);
}