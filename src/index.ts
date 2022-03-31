#!/usr/bin/env node
import ProgressBar from 'progress'
import ffmpeg from 'ffmpeg'
import path from 'path'

import { validateTimeStamp } from './utils/validate-timestamp'

const args = process.argv.slice(2)
const startTimestamp = validateTimeStamp(args[0])
const endTimestamp = validateTimeStamp(args[1])
const splitCount = Math.ceil((endTimestamp - startTimestamp) / 30)
const videoFile = path.join(process.cwd(), args[2])
const bar = new ProgressBar(':percent :bar [:current/:total] :elapsed', {
  total: splitCount,
  clear: true,
  width: 20,
})

console.log(`Start Timestamp : ${args[0]} (${startTimestamp})`)
console.log(`End Timestamp   : ${args[1]} (${endTimestamp})`)
console.log(`Split Count     : ${splitCount}
Please wait until the process is done...`)

bar.render()

for (let i = 0; i < splitCount; i++) {
  try {
    new ffmpeg(videoFile, function (err, video) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const parsedVideoFileName = path.parse(videoFile)
      const videoFileNameWithoutExt = path.join(
        parsedVideoFileName.dir,
        parsedVideoFileName.name
      )

      video
        .setVideoStartTime(startTimestamp + 30 * i)
        .setVideoDuration(
          i === splitCount - 1 ? endTimestamp - (startTimestamp + 30 * i) : 30
        )
        .save(
          videoFileNameWithoutExt + '-wa-' + (i + 1) + parsedVideoFileName.ext,
          (err) => {
            if (err) {
              console.error(err)
              process.exit(1)
            }
            bar.tick()
            // console.log(`${file} has beed trimmed`)
          }
        )
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
