import { resolve } from 'path'
import { info } from './colorization'
import logger from './log'
import { platform } from 'os'

let osuPath: string

if (platform() === 'linux') {
    osuPath = resolve(process.env['HOME'] as string, '.local/share/osu/')
} else {
    osuPath = '¯\\_(ツ)_/¯ IDK'
}

logger.log(info + 'OSU Directory: ', osuPath)

export default osuPath
