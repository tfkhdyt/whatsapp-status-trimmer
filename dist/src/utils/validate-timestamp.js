"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimeStamp = void 0;
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
exports.validateTimeStamp = validateTimeStamp;
