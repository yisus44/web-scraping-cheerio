const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs-extra");
//create file without data
const writeSream = fs.createWriteStream("quotes.csv");

async function init(uri) {
  //init cheerio
  const $ = await request({
    uri,
    transform: (body) => cheerio.load(body),
  });
  const quoteRegex = /(^\“|\”$)/g;

  writeSream.write("Quotes | Author | Tags \n");

  $(".quote").each(function (index, element) {
    const text = $(element).find("span.text").text().replace(quoteRegex, "");
    const author = $(element).find("span small.author").text();
    const tags = [];
    $(element)
      .find(".tags a.tag")
      .each(function (index, element) {
        tags.push($(element).text());
      });
    writeSream.write(`${text}|${author}|${tags}\n`);
  });
}

init("http://quotes.toscrape.com/");
