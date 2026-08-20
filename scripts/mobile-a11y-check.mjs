const baseUrl = process.env.CHECK_URL ?? "https://3000-im8xsywuic9qfppbgbpco-afb6176f.us3.manus.computer/";
const debugPort = process.env.CDP_PORT ?? "9222";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPageSocketUrl() {
  const targets = await fetch(`http://127.0.0.1:${debugPort}/json`).then(response => response.json());
  const page = targets.find(target => target.type === "page");
  if (!page?.webSocketDebuggerUrl) throw new Error("Chromiumのページ接続先を取得できませんでした。");
  return page.webSocketDebuggerUrl;
}

function openCdp(socketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(socketUrl);
    const pending = new Map();
    let requestId = 0;

    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = ++requestId;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((resolveCommand, rejectCommand) => pending.set(id, { resolve: resolveCommand, reject: rejectCommand }));
        },
        close() {
          socket.close();
        },
      });
    });

    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
    });

    socket.addEventListener("error", () => reject(new Error("Chromiumとの接続に失敗しました。")));
  });
}

async function key(cdp, keyName, code, modifiers = 0) {
  const keyCode = keyName === "Tab" ? 9 : keyName === "Enter" ? 13 : 32;
  const text = keyName === "Enter" ? "\r" : keyName === " " ? " " : undefined;
  await cdp.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers, text, unmodifiedText: text });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers });
  await delay(100);
}

async function active(cdp) {
  const expression = `(() => {
    const node = document.activeElement;
    const menu = document.querySelector('.mobile-menu-button');
    const panel = document.getElementById('mobile-menu-panel');
    return JSON.stringify({
      tag: node?.tagName ?? null,
      text: node?.textContent?.trim() ?? null,
      href: node instanceof HTMLAnchorElement ? node.getAttribute('href') : null,
      outline: node ? getComputedStyle(node).outlineStyle : null,
      menuExpanded: menu?.getAttribute('aria-expanded') ?? null,
      menuLabel: menu?.getAttribute('aria-label') ?? null,
      panelClass: panel?.className ?? null,
      viewport: { width: innerWidth, height: innerHeight },
    });
  })()`;
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true });
  return JSON.parse(result.result.value);
}

async function main() {
  const socketUrl = await getPageSocketUrl();
  const cdp = await openCdp(socketUrl);
  try {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await cdp.send("Page.navigate", { url: baseUrl });
    await delay(1200);

    const results = [];
    await key(cdp, "Tab", "Tab");
    results.push({ step: "Tab 1", expected: "本文へ移動", actual: await active(cdp) });
    await key(cdp, "Tab", "Tab");
    results.push({ step: "Tab 2", expected: "EMULABO", actual: await active(cdp) });
    await key(cdp, "Tab", "Tab");
    results.push({ step: "Tab 3", expected: "メニューを開く", actual: await active(cdp) });
    await key(cdp, "Enter", "Enter");
    results.push({ step: "Enter", expected: "メニューが開く", actual: await active(cdp) });
    await key(cdp, "Tab", "Tab");
    results.push({ step: "開いたメニューでTab", expected: "法人向け", actual: await active(cdp) });
    await key(cdp, "Tab", "Tab", 8);
    await key(cdp, " ", "Space");
    results.push({ step: "Shift+Tab → Space", expected: "メニューが閉じる", actual: await active(cdp) });

    const failed = results.filter(({ step, actual }) => {
      if (step === "Tab 1") return actual.text !== "本文へ移動" || !["auto", "solid"].includes(actual.outline);
      if (step === "Tab 2") return actual.text !== "EMULABO" || actual.outline !== "auto";
      if (step === "Tab 3") return actual.menuExpanded !== "false" || actual.menuLabel !== "メニューを開く";
      if (step === "Enter") return actual.menuExpanded !== "true" || actual.menuLabel !== "メニューを閉じる";
      if (step === "開いたメニューでTab") return actual.text !== "法人向け" || actual.outline !== "auto";
      return actual.menuExpanded !== "false" || actual.menuLabel !== "メニューを開く";
    });

    console.log(JSON.stringify({ baseUrl, results, passed: failed.length === 0, failedSteps: failed.map(item => item.step) }, null, 2));
    process.exitCode = failed.length === 0 ? 0 : 1;
  } finally {
    cdp.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
