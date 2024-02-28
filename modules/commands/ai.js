const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "tnt",
  description: "Chatgpt",
  commandCategory: "Hệ Thống",
  usages: "ai",
  cooldowns: 0,
};

let lastQuery = "";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    api.sendMessage("Hãy nhập câu hỏi cần tìm kiếm!", threadID, messageID);
    return;
  }

  const query = args.join(" ");

  if (query === lastQuery) {
    api.sendMessage("Lỗi", threadID, messageID);
    return;
  } else {
    lastQuery = query;
  }

  api.sendMessage(":) ", threadID, messageID);

  try {
    const response = await axios.get(`https://api-7izq.onrender.com/chatgpt5?text=${encodeURIComponent(query)}&apikey=TNTXTRICK_3221971149`);

    if (response.status === 200 && response.data && response.data.response) { 
      const answer = response.data.response; 
      const formattedAnswer = formatFont(answer); 
      api.sendMessage(formattedAnswer, threadID, messageID);
    } else {
      api.sendMessage("Xin lỗi, không có câu trả lời", threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("Loading...", threadID, messageID);
    return;
  }
};

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    formattedText += fontMapping[char] || char; 
  }
  return formattedText;
}
