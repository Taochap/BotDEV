const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const axios = require('axios');

const downloadMusicFromYoutube = async (link, path) => {
    if (!link) return 'Thiếu link';
    const timestart = Date.now();

    return new Promise(async (resolve, reject) => {
        const videoStream = ytdl(link, { filter: format => format.quality === 'tiny' && format.audioBitrate === 48 && format.hasAudio === true });
        const writeStream = fs.createWriteStream(path);

        videoStream.pipe(writeStream);

        writeStream.on('close', async () => {
            const data = await ytdl.getInfo(link);
            const result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                uploadDate: data.videoDetails.uploadDate,
                sub: data.videoDetails.author.subscriber_count,
                author: data.videoDetails.author.name,
                timestart,
            };
            resolve(result);
        });
    });
};

const convertHMS = value => {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
};

const path = __dirname + '/cache/whatthefuck.mp4';

const config = {
    name: 'autodown2',
    hasPermission: 0,
    version: '1.0',
    description: 'atd music',
    credits: 'Sam',//mod tnt
    commandCategory: 'Tiện ích',
    usages: '[args]',
    cooldowns: 5,
};

const handleEvent = async ({ api, event, Threads }) => {
    const m = (await Threads.getData(event.threadID)).data;
    if (m[config.name] === false) return;

    for (const i of event.body.split(' ')) {
        if (i.indexOf('https://') === 0) {
            for (const e of i.split('/')) {
                if (e === 'youtu.be' || e === 'www.youtube.com' || e === 'youtube.com') {
                    const youtube = __dirname + '/cache/wtf.mp3';
                    const data = await downloadMusicFromYoutube(i, youtube);
                    api.sendMessage(
                        {
                            body: ` Music: ${data.title}\n Time: ${convertHMS(data.dur)}`,
                            attachment: fs.createReadStream(youtube),
                        },
                        event.threadID,
                        () => fs.unlinkSync(youtube)
                    );
                }

                
            }
        }
    }
    return;
};

const run = async ({ api, event, Threads }) => {
    const data = (await Threads.getData(event.threadID)).data;
    data[config.name] = !data[config.name];
    await Threads.setData(event.threadID, { data });

    return api.sendMessage(
        {
            body: `${data[config.name] ? 'Bật' : 'Tắt'} thành công autoDown`,
        },
        event.threadID
    );
};

module.exports = {
    config,
    handleEvent,
    run,
};
