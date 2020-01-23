var req = require('request-promise');
var $ = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchData(page,selector,jsData){

    //the main product object to save in json file
    let mainProduct = {};
    
    console.log(jsData.hasOwnProperty('Blueprint'));
    await page.waitForSelector('#navFooter');

    //getting the active products array       
     mainProduct = await page.evaluate((jsData,sel)=>{
         
        let product = {};
        //array of product titles
        let titles = Array.from(document.querySelectorAll(sel));
        let tLen = titles.length;

        let itemType = sel.match('active')?'active':'saved';     
             
        
        let currentPrices = Array.from(document.querySelectorAll('[data-itemtype="'+itemType+'"] > div p span.sc-price'));
        let active = true;
        let min=0;
        let change;

        for(let i=0;i<tLen;i++){
            let t = titles[i].textContent.trim();
            let p = currentPrices[i].innerText.trim().replace(/\,/g,'');
            let obj = {};

            
            if(!jsData[itemType].hasOwnProperty(t)){
                obj.price = parseFloat(p);
                obj.min = parseFloat(p);
                obj.change = "none";
            }
            else{
                obj.price = parseFloat(p);
                let tempMin = jsData[itemType][t].min;
                obj.min = Math.min(p,parseFloat(tempMin));
                if(parseFloat(jsData[itemType][t].price) >p){
                    obj.change="decreased";
                }
                else if(parseFloat(jsData[itemType][t].price) <p){
                    obj.change = "increased";
                }
                else{
                    obj.change = jsData[itemType][t].change;
                }
            }
            product[t] = obj;
        }

        return product;
    },jsData,selector);
    
    console.log(mainProduct);

          
        //  await fs.writeFileSync('product.json',JSON.stringify(activeProducts));
    return mainProduct;
          
}

module.exports = fetchData;