addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // 定义后缀与相应文件的映射
  const suffixToTrackerMap = {
    'best': 'trackers_best.txt',
    'all': 'trackers_all.txt',
    'all_udp': 'trackers_all_udp.txt',
    'all_htt': 'trackers_all_http.txt',
    'all_https': 'trackers_all_https.txt',
    'all_ws': 'trackers_all_ws.txt',
    'best_ip': 'trackers_best_ip.txt',
    'all_ip': 'trackers_all_ip.txt',
    // 添加其他后缀与文件的映射
  };

  const suffix = url.pathname.split('/').pop() || 'best'; // 获取 URL 的最后一部分作为后缀，如果没有就默认使用 'best'
  const trackerFile = suffixToTrackerMap[suffix];

  if (trackerFile) {
    const trackerUrl = `https://raw.githubusercontent.com/ngosang/trackerslist/master/${trackerFile}`;

    const response = await fetch(trackerUrl);

    if (response.ok) {
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

      // 返回处理后的文本内容
      return new Response(aria2textFinal, {
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      return new Response('Network response was not ok', { status: response.status });
    }
  } else {
    return new Response('Invalid or unsupported URL suffix', { status: 400 });
  }
}
