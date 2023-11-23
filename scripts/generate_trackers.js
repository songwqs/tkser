const fs = require('fs');
const fetch = require('node-fetch');

async function generateTrackers() {
  const suffixToTrackerMap = {
    'aria2_best': 'trackers_best.txt',
    'aria2_all': 'trackers_all.txt',
    'aria2_all_udp': 'trackers_all_udp.txt',
    'aria2_all_htt': 'trackers_all_http.txt',
    'aria2_all_https': 'trackers_all_https.txt',
    'aria2_all_ws': 'trackers_all_ws.txt',
    'aria2_best_ip': 'trackers_best_ip.txt',
    'aria2_all_ip': 'trackers_all_ip.txt',
    // 添加其他后缀与文件的映射
  };

  const defaultSuffix = 'best';
  const suffix = process.argv[2] || defaultSuffix;
  const trackerFiles = Object.values(suffixToTrackerMap);

  for (const trackerFile of trackerFiles) {
    const trackerUrl = `https://raw.githubusercontent.com/ngosang/trackerslist/master/${trackerFile}`;
    const response = await fetch(trackerUrl);

    if (!response.ok) {
      console.error(`Failed to fetch tracker file: ${trackerFile}`);
      process.exit(1);
    }

    const aria2text = await response.text();
    const ch = "announce";
    const reg = new RegExp(ch, "g");
    const ckok = "announce,";

    // 移除所有空白字符
    const aria2textNoSpaces = aria2text.replace(/\s/g, "");

    // 使用正则表达式替换 "announce" 并加上逗号
    const aria2textOk = aria2textNoSpaces.replace(reg, ckok);

    // 移除字符串末尾的逗号
    const aria2textFinal = aria2textOk.substring(0, aria2textOk.length - 1);

    // 写入文件到仓库的工作目录
    const outputFilePath = `./${trackerFile}`;
    fs.writeFileSync(outputFilePath, aria2textFinal, 'utf-8');

    console.log(`Generated tracker file: ${outputFilePath}`);
  }
}

generateTrackers();
