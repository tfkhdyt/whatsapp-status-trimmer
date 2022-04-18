#!/usr/bin/env node
import ProgressBar from 'progress'
import path from 'path'

import { validateTimeStamp } from './utils/validate-timestamp'
import showHelpMenu from './utils/show-help-menu'
import metadata from '../package.json'
import splitVideo from './utils/split-video'

const args = process.argv.slice(2)

if (args.length === 1) {
  const appVersion = metadata.version
  if (['-v', '--version'].includes(args[0])) {
    console.log(appVersion)
    process.exit(0)
  } else if (['-h', '--help'].includes(args[0])) {
    showHelpMenu(appVersion)
    process.exit(0)
  } else {
    console.error('Option is not valid:', args[0])
    process.exit(1)
  }
} else if (args.length !== 3) {
  console.error('Some arguments are missing!')
  process.exit(1)
}

const startTimestamp = validateTimeStamp(args[0])
const endTimestamp = validateTimeStamp(args[1])
const splitCount = Math.ceil((endTimestamp - startTimestamp) / 30)
const videoFile = path.join(process.cwd(), args[2])

const bar = new ProgressBar(':percent :bar [:current/:total]', {
  total: splitCount,
  clear: true,
  width: 30,
  callback: () => {
    console.log('Finished')
  },
})

console.log(`Start Timestamp : ${args[0]} (${startTimestamp})`)
console.log(`End Timestamp   : ${args[1]} (${endTimestamp})`)
console.log(`Split Count     : ${splitCount}`)

if (!bar.complete) {
  console.log('\nPlease wait until the process is done...')
}

bar.render()

for (let i = 0; i < splitCount; i++) {
  try {
    splitVideo({
      videoFile: decodeURIComponent(videoFile),
      startTimestamp,
      endTimestamp,
      i,
      splitCount,
      bar,
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
