import { chromium } from "playwright-core";

const url = process.env.CHECK_URL ?? "https://3000-im8xsywuic9qfppbgbpco-afb6176f.us3.manus.computer/";

async function focused(page) {
  return page.evaluate(() => {
    const node = document.activeElement;
    const menu = document.querySelector("button.mobile-menu-button");
    const panel = document.getElementById("mobile-menu-panel");
    return {
      tag: node?.tagName ?? null,
      text: node?.textContent?.trim() ?? null,
      href: node instanceof HTMLAnchorElement ? node.getAttribute("href") : null,
      outline: node ? getComputedStyle(node).outlineStyle : null,
      menuExpanded: menu?.getAttribute("aria-expanded") ?? null,
      menuLabel: menu?.getAttribute("aria-label") ?? null,
      panelClass: panel?.className ?? null,
      panelInert: panel?.inert ?? null,
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
}

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("button.mobile-menu-button");

  const steps = [];
  await page.keyboard.press("Tab");
  steps.push({ step: "Tab 1", actual: await focused(page) });
  await page.keyboard.press("Tab");
  steps.push({ step: "Tab 2", actual: await focused(page) });
  await page.keyboard.press("Tab");
  steps.push({ step: "Tab 3", actual: await focused(page) });
  await page.keyboard.press("Enter");
  steps.push({ step: "Enter", actual: await focused(page) });
  await page.keyboard.press("Tab");
  steps.push({ step: "開いたメニューでTab", actual: await focused(page) });
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press(" ");
  steps.push({ step: "Shift+Tab → Space", actual: await focused(page) });

  const failures = [];
  const [skip, brand, menu, opened, firstLink, closed] = steps.map(item => item.actual);
  if (skip.text !== "本文へ移動" || !["auto", "solid"].includes(skip.outline)) failures.push("Tab 1");
  if (brand.text !== "EMULABO" || !["auto", "solid"].includes(brand.outline)) failures.push("Tab 2");
  if (menu.tag !== "BUTTON" || menu.menuExpanded !== "false" || menu.menuLabel !== "メニューを開く" || menu.panelInert !== true) failures.push("Tab 3");
  if (opened.menuExpanded !== "true" || opened.menuLabel !== "メニューを閉じる" || opened.panelInert !== false) failures.push("Enter");
  if (firstLink.text !== "法人向け" || !["auto", "solid"].includes(firstLink.outline)) failures.push("開いたメニューでTab");
  if (closed.menuExpanded !== "false" || closed.menuLabel !== "メニューを開く" || closed.panelInert !== true) failures.push("Shift+Tab → Space");

  console.log(JSON.stringify({ url, steps, passed: failures.length === 0, failedSteps: failures }, null, 2));
  process.exitCode = failures.length === 0 ? 0 : 1;
  await context.close();
} finally {
  await browser.close();
}
