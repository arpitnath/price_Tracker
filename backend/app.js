const request = require("request-promise");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");

const url = "https://www.amazon.in/New-Apple-Watch-GPS-40mm/dp/B08J6MWXMH/";

const configBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  return page;
};

const checkPrice = async () => {
  //   let data;
  const response = await request({
    uri: url,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,la;q=0.8",
    },
    gzip: true,
  });
  let $ = cheerio.load(response);
  let price = $('span[id= "priceblock_ourprice"]').text();

  //   price.push(data);
  console.log(price);
  let currentPrice = Number(price.replace(/[^0-9.-]+/g, ""));
  console.log(currentPrice);

  if (currentPrice < 30000) {
    console.log("BUY now at ₹ " + currentPrice);
  }
};

const monitor = async () => {
  let page = await configBrowser();
  await checkPrice();
};

monitor();
