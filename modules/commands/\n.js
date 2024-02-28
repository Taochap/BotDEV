module.exports.config = {
	name: "\n",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Xem thông tin thời gian sử dụng bot",
	commandCategory: "Người dùng",
	cooldowns: 5,
	dependencies: {
		"systeminformation": "",
		"pidusage": ""
	}
};
function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}
module.exports.run = async function ({ api, event }) {
	const { time, cpu } = global.nodemodule["systeminformation"];
	const timeStart = Date.now();

	try {
		 const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);

    var upt = {
       body: "Thời gian hoạt động: " + hours + ":" + minutes + ":" + seconds +"\nLệnh bạn sử dụng không tồn tại!",
    }
    return api.sendMessage(upt,event.threadID, event.messageID)
	}
	catch (e) {
		console.log(e)
	}
}
