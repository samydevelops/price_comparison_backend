import { Hono } from "hono";
import { cors } from 'hono/cors';
import { scrapeAmazon, scrapeFlipkart } from "./scraper";
import { z } from "zod";
const app = new Hono();
app.use(
  cors({
    origin: 'http://localhost:3000', // Next.js default dev server
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

app.get("/", (c) => c.text("Amazon Mobile Scraper is running"));

const SearchSchema = z.object({
	keyword: z.string(),
});

app.post("/scrape", async (c) => {
	const body = await c.req.json();
	const parsed = SearchSchema.safeParse(body);
	if (!parsed.success) {
		return c.json(
			{ error: "Invalid input", details: parsed.error.errors },
			400,
		);
	}
	const searchTerm: string = parsed.data.keyword;
	const amzdata = await scrapeAmazon(searchTerm);
	const flpdata = await scrapeFlipkart(searchTerm);
	const alldata = {
		amazon_data: amzdata,
		flipkart_data: flpdata,
	};
	return c.json(alldata);
});

export default app;
