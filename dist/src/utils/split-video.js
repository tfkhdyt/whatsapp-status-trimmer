"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffmpeg_1 = __importDefault(require("ffmpeg"));
const path_1 = __importDefault(require("path"));
function splitVideo(opts) {
    const { videoFile, startTimestamp, endTimestamp, i, splitCount, bar } = opts;
    new ffmpeg_1.default(videoFile, function (err, video) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const parsedVideoFileName = path_1.default.parse(videoFile);
        const videoFileNameWithoutExt = path_1.default.join(parsedVideoFileName.dir, parsedVideoFileName.name);
        video
            .setVideoStartTime(startTimestamp + 30 * i)
            .setVideoDuration(i === splitCount - 1 ? endTimestamp - (startTimestamp + 30 * i) : 30)
            .save(videoFileNameWithoutExt + '-wa-' + (i + 1) + parsedVideoFileName.ext, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            bar.tick();
            // console.log(`${file} has beed trimmed`)
        });
    });
}
exports.default = splitVideo;
