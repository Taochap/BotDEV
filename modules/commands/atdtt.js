const axios = require('axios');
const fs = require('fs');
const { downloadFile } = require('../../utils/index');

exports.handleEvent = async function ({ event, api }) {
    try {
        const str = event.body;
        const send = msg => api.sendMessage(msg, event.threadID, event.messageID);
        const head = app => `==『 AUTODOWN ${app.toUpperCase()} 』==\n────────────────`;

        if (/^http(|s):\/\//.test(str)) {
            if (/fb|facebook/.test(str)) {
                const json = await infoPostFb(str);
                const body = `${head('FACEBOOK')}\n- Tiêu Đề: ${json.message}`;
                const attachment = json.attachment.map(i => streamURL(i.photo_image || i.image?.uri || i.browser_native_hd_url || i.play, 'jpg'));
                
                for (const file of await Promise.all(attachment)) {
                    try {
                        await send({ body, attachment: file });
                    } catch {
                        continue;
                    }
                }
            } else if (/((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
                const json = await infoPostTT(str);
                const attachment = json.images ? json.images.map(image => streamURL(image, 'png')) : [streamURL(json.play, 'mp4')];
                
                send({
                    body: `${head('TIKTOK')}\nAuthor: ${json.author.nickname}\nTiêu Đề : ${json.title}`,
                    attachment: await Promise.all(attachment)
                });
            } else if (/instagram\.com/.test(str)) {
                const res = await axios.get(`https://phungtuanhai.site/instagram/dlpost?apikey=PTH&url=${str}`);
                const { videos = [{}], images } = res.data;
                const attachment = videos[0] ? [streamURL(videos[0], 'mp4')] : images ? images.split(',').map(image => streamURL(image, 'png')) : [];

                send({
                    body: `${head('INSTAGRAM')}\n Tiêu Đề: ${res.data.caption}`,
                    attachment: await Promise.all(attachment)
                });
            }
        }
    } catch (e) {
        console.log('Error', e);
    }
};

exports.run = () => {};

exports.config = {
    name: 'atdo',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Công Nam',//mod tnt
    description: '',
    commandCategory: 'Tự động',
    usages: [],
    cooldowns: 1
};

function streamURL(url, type) {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        const path = __dirname + `/cache/${Date.now()}.${type}`;
        fs.writeFileSync(path, res.data);
        setTimeout(() => fs.unlinkSync(path), 1000 * 60);
        return fs.createReadStream(path);
    });
}

function infoPostTT(url) {
    return axios.post('https://tikwm.com/api/', { url }).then(res => res.data.data);
}

function infoPostFb(url) {
    return axios.get(`https://duongkum999.codes/fb/info-post?url=${url}`).then(res => res.data);
}
