export default function showHelpMenu(appVersion: string) {
  console.log(`WhatsApp Status Trimmer (WAST) - ${appVersion}

Simple Node.js script to trim and split a video into 30s videos for WhatsApp Status


Usage: 
  wast <start timestamp> <end timestamp> <input file>
  wast <options>


Example:
  wast 00:00:23 00:01:40 weightless.mp4

  The output would be 3 videos:
    1. 00:00:23 - 00:00:53
    2. 00:00:53 - 00:01:23
    3. 00:01:23 - 00:01:40


Options:
  -h, --help            Show help menu
  -v, --version         Show app version
`)
}
