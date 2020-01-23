var req = require('request-promise');
var $ = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');
const fetch = require('./FetchProduct');

const url = "https://www.amazon.in";

(async()=>{
    const browser = await puppeteer.launch({headless:false,userDataDir: "./user_data"});
   
    try{

        let page = await browser.newPage();
      //   page = await initC(page,url);
         await page.goto(url);
         await page.waitForSelector('#nav-tools');
       
        const header = await page.evaluate(()=>{
            return document.querySelector('#nav-link-accountList > span.nav-line-1').textContent;
        });
        console.log(` ${header}`);


         await page.setViewport({
            width: 1200,
            height: 800
        });

        await page.click('#nav-cart');
        await page.screenshot({path: 'screenshot.png'});

        await page.waitForSelector('#navFooter');

         //call the fetchDta functuon inside FetchProduct

         
      const activeItems = await page.evaluate(()=>{

        window.scrollTo(0,document.querySelector('body').scrollHeight);

                    return document.querySelectorAll('[data-itemtype="active"]');
        }); 

        await page.waitForSelector("#sc-item-S5737edfb-f09d-4a02-87f9-ba2c3dd4d04c");
        const savedItems = await page.evaluate(()=>{

          //  window.scrollTo(0,document.querySelector('body').scrollHeight);
    
                        return document.querySelectorAll('[data-itemtype="saved"]');
            }); 

         console.log("the active items count is "+ Object.keys(activeItems).length);
         console.log("the saved items count is "+ Object.keys(savedItems).length);

       
         const json = fs.readFileSync('product.json');
         const jsData = JSON.parse(json);
         
        let activeSet = await fetch(page,'[data-itemtype="active"] > div  ul a span.sc-product-title',jsData);
        let savedSet =await fetch(page,'[data-itemtype="saved"] > div  ul a span.sc-product-title',jsData);
        
        let jsObject = {active: activeSet,saved:savedSet};


        await fs.writeFileSync('product.json', JSON.stringify(jsObject));



    }
    catch(err){
        console.log(err);
    }
})();


function setBooks(){

}
