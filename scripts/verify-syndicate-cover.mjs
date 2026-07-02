import { chromium } from "playwright"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
await page.goto("http://localhost:3000/creative-director", { waitUntil: "networkidle" })
await page.waitForSelector("#client-work button", { timeout: 15000 })

const buttons = await page.locator("#client-work button").all()
for (const btn of buttons) {
  const text = await btn.innerText()
  if (text.includes("FASHION SHOW") || text.includes("Syndicate")) {
    await btn.click()
    break
  }
}

await page.waitForSelector('[aria-label="FASHION SHOW magazine"]', { timeout: 10000 })
await page.waitForTimeout(2000)

const result = await page.evaluate(() => {
  const cover = document.querySelector(".magazine-cover")
  if (!cover) return { error: "no cover section" }

  const header = cover.querySelector(".bg-\\[\\#050505\\]")
  const poster = cover.querySelector("figure img")
  if (!header || !poster) return { error: "missing header or poster" }

  const headerRect = header.getBoundingClientRect()
  const posterRect = poster.getBoundingClientRect()
  const h1 = header.querySelector("h1")

  return {
    layout: "stacked",
    headerBottom: headerRect.bottom,
    posterTop: posterRect.top,
    gap: posterRect.top - headerRect.bottom,
    headerAbovePoster: headerRect.bottom <= posterRect.top + 1,
    noOverlay: !cover.querySelector(".overflow-hidden"),
    titleText: h1?.textContent?.trim(),
  }
})

console.log(JSON.stringify(result, null, 2))
await page.screenshot({ path: "syndicate-cover-mobile.png", fullPage: false })
await browser.close()

if (!result.headerAbovePoster || !result.noOverlay) process.exit(1)
