#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffmpeg_1 = __importDefault(require("ffmpeg"));
const path_1 = __importDefault(require("path"));
const args = process.argv.slice(2);
// console.log(args)
const validateTimeStamp = (timestamp) => {
    if (timestamp.length !== 8 ||
        !timestamp.includes(':') ||
        timestamp.split(':').length !== 3) {
        console.error('Timestamp is not valid:', timestamp);
        process.exit(1);
    }
    const timestampArr = timestamp.split(':').map(Number);
    const seconds = timestampArr[0] * 3600 + timestampArr[1] * 60 + timestampArr[2];
    return seconds;
};
const startTimestamp = validateTimeStamp(args[0]);
const endTimestamp = validateTimeStamp(args[1]);
console.log(`Start Timestamp : ${args[0]} (${startTimestamp})`);
console.log(`End Timestamp   : ${args[1]} (${endTimestamp})`);
const splitCount = Math.ceil((endTimestamp - startTimestamp) / 30);
console.log(`Split Count     : ${splitCount}`);
const videoFile = path_1.default.join(process.cwd(), args[2]);
for (let i = 0; i < splitCount; i++) {
    try {
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
                .save(videoFileNameWithoutExt + '-wa-' + (i + 1) + parsedVideoFileName.ext, (err, file) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log(`${file} has beed trimmed`);
            });
        });
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}