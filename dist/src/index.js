#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = __importDefault(require("progress"));
const path_1 = __importDefault(require("path"));
const validate_timestamp_1 = require("./utils/validate-timestamp");
const show_help_menu_1 = __importDefault(require("./utils/show-help-menu"));
const package_json_1 = __importDefault(require("../package.json"));
const split_video_1 = __importDefault(require("./utils/split-video"));
const args = process.argv.slice(2);
if (args.length === 1) {
    const appVersion = package_json_1.default.version;
    if (['-v', '--version'].includes(args[0])) {
        console.log(appVersion);
        process.exit(0);
    }
    else if (['-h', '--help'].includes(args[0])) {
        (0, show_help_menu_1.default)(appVersion);
        process.exit(0);
    }
    else {
        console.error('Option is not valid:', args[0]);
        process.exit(1);
    }
}
else if (args.length !== 3) {
    console.error('Some arguments are missing!');
    process.exit(1);
}
const startTimestamp = (0, validate_timestamp_1.validateTimeStamp)(args[0]);
const endTimestamp = (0, validate_timestamp_1.validateTimeStamp)(args[1]);
const splitCount = Math.ceil((endTimestamp - startTimestamp) / 30);
const videoFile = path_1.default.join(process.cwd(), args[2]);
const bar = new progress_1.default(':percent :bar [:current/:total]', {
    total: splitCount,
    clear: true,
    width: 30,
    callback: () => {
        console.log('Finished');
    },
});
console.log(`Start Timestamp : ${args[0]} (${startTimestamp})`);
console.log(`End Timestamp   : ${args[1]} (${endTimestamp})`);
console.log(`Split Count     : ${splitCount}`);
if (!bar.complete) {
    console.log('\nPlease wait until the process is done...');
}
bar.render();
for (let i = 0; i < splitCount; i++) {
    try {
        (0, split_video_1.default)({
            videoFile: decodeURIComponent(videoFile),
            startTimestamp,
            endTimestamp,
            i,
            splitCount,
            bar,
        });
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
