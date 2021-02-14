//import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Builder, By, Key, until } = require('selenium-webdriver');
var fs = require('fs');
const { nextTick } = require('process');

//delay
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//url parser
app.use(bodyParser.urlencoded({ extended: true }));
//result

//home page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');

}).listen(3000)

//take enter key
app.post('/key', (req, res) => {
  key = req.body.key
  fs.readFile('huge.crx', 'base64', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    crx(data)
  })
  function crx(data) {
    (async function example() {
      var webdriver = require("selenium-webdriver");
      var chrome = require("selenium-webdriver/chrome");
      var options = new chrome.Options();
      options.setChromeBinaryPath('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
      options.addExtensions(data);
      let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

      try {
        const keywords = [];
        await driver.get('http://www.amazon.de');
        await driver.findElement(By.id('twotabsearchtextbox')).sendKeys(key);
        sleep(2000);
        for (i = 1; i++;) {
          try {
            let search = await driver.findElement(By.xpath(`//*[@id="mmdamlknnafgffhlobhlmiljonijdnid-additional-suggestions"]/li[${i}]/a`)).getAttribute('innerHTML');
            //diziye ekle
            let data1 = JSON.stringify(search);
            keywords.push(`${search}`)
          } catch (error) {
            console.log('BRO look at this: ' + error)
            break;
          }
        }
        let data1 = JSON.stringify(keywords);
        fs.writeFileSync(`./keywords/${key}.json`, data1)
      } catch (err) {
        console.log(err)
      }
      finally {
        let rawdata = fs.readFileSync(`keywords/${key}.json`);
        let student = JSON.parse(rawdata);
        res.send(student)
        await driver.quit();
      }
    })();
  }
});