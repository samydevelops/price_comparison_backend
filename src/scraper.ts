import { chromium } from "playwright";


export async function scrapeAmazon(searchTerm: string): Promise<any[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = "https://www.amazon.in/";
  await page.goto(url);

  await page.fill('input[name="field-keywords"]', searchTerm);
  await Promise.all([
    page.waitForNavigation(),
    page.click("input#nav-search-submit-button"),
  ]);

  await page.waitForSelector(".s-main-slot");

  const products = await page.$$eval(
    '.s-main-slot > div[data-component-type="s-search-result"]',
    (items) => {
      return items
        .map((el) => {
          const title = el.querySelector("h2 span")?.textContent?.trim() ?? "";
          const price =
            el
              .querySelector(".a-price span.a-offscreen")
              ?.textContent?.trim() ?? "";
          const link =
            (
              el.querySelector(
                ".a-link-normal.s-no-outline"
              ) as HTMLAnchorElement
            )?.href ?? "";
          const image =
            (el.querySelector(".s-image") as HTMLImageElement)?.src ?? "";

          return { title, price, link, image };
        })
        .filter((product) =>
          Object.values(product).every((value) => value && value.trim() !== "")
        );
    }
  );

  await browser.close();
  return products;
}


export async function scrapeFlipkart(searchTerm: string): Promise<any[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.flipkart.com/");

  // Close login popup if shown
  try {
    await page.click("button._2KpZ6l._2doB4z", { timeout: 3000 });
  } catch {}

  // Search for "mobiles"
  await page.fill(".Pke_EE", searchTerm);
  await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);

  await page.waitForSelector(".cPHDOP");

  const products = await page.$$eval(".cPHDOP", (items) => {
    return items
      .map((el) => {
        const title =
          el.querySelector(".wjcEIp, .KzDlHZ")?.textContent?.trim() ?? "";
        const price = el.querySelector(".Nx9bqj")?.textContent?.trim() ?? "";
        const link =
          (el.querySelector(".VJA3rP, .CGtC98") as HTMLAnchorElement)?.href ??
          "";
        const image =
          (el.querySelector(".DByuf4") as HTMLImageElement)?.src ?? "";

        return { title, price, link, image };
      })
      .filter((product) =>
        Object.values(product).every((value) => value && value.trim() !== "")
      );
  });

  await browser.close();
  return products;
}
