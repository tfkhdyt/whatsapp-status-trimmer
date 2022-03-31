import ProgressBar from 'progress'
import ffmpeg from 'ffmpeg'
import path from 'path'

interface SplitVideoOpts {
  videoFile: string
  startTimestamp: number
  endTimestamp: number
  i: number
  splitCount: number
  bar: ProgressBar
}

export default function splitVideo(opts: SplitVideoOpts) {
  const { videoFile, startTimestamp, endTimestamp, i, splitCount, bar } = opts
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
}
