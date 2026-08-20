import { chromium } from "playwright-core";

const url =
  process.env.CHECK_URL ??
  "https://3000-im8xsywuic9qfppbgbpco-afb6176f.us3.manus.computer/videos/acceptance-placeholder-video";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("video");
  await page.waitForFunction(() => {
    const video = document.querySelector("video");
    return Boolean(video && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && video.duration > 0);
  });

  const before = await page.locator("video").evaluate(video => ({
    readyState: video.readyState,
    duration: video.duration,
    error: video.error?.message ?? null,
    rect: (() => {
      const { width, height, right } = video.getBoundingClientRect();
      return { width, height, right, viewportWidth: window.innerWidth };
    })(),
  }));

  await page.locator("video").evaluate(video => video.play());
  await page.waitForFunction(() => {
    const video = document.querySelector("video");
    return Boolean(video && (video.currentTime > 0.15 || video.ended));
  });

  const after = await page.locator("video").evaluate(video => ({
    currentTime: video.currentTime,
    duration: video.duration,
    paused: video.paused,
    ended: video.ended,
    readyState: video.readyState,
    error: video.error?.message ?? null,
  }));

  const layoutPass = before.rect.width > 0 && before.rect.height > 0 && before.rect.right <= before.rect.viewportWidth + 0.5;
  const playbackPass = after.currentTime > 0.15 || after.ended;
  const passed = layoutPass && playbackPass && before.error === null && after.error === null;
  console.log(JSON.stringify({ url, viewport: { width: 390, height: 844 }, before, after, layoutPass, playbackPass, passed }, null, 2));
  process.exitCode = passed ? 0 : 1;
  await context.close();
} finally {
  await browser.close();
}
