const fs = require('fs');

const cookiesArr = require(`.${cookies}`);

async function initCookies(page,url){
    try{
        await page.goto(url);
        const cookies = await page.cookies();

      //  console.log(cookies);
         //let json1 = JSON.parse(cookies);
        let jsoncookie = JSON.stringify(cookies);

        await fs.writeFile('cookies.json',jsoncookie,function(err){
            if(err){
                console.log("not able to write");
                
            }
            else{
                console.log("cookies written to json file")
            }
        });
        if (cookiesArr.length !== 0) {
            for (let cookie of cookiesArr) {
              await page.setCookie(cookie);
            }
            console.log('Session has been loaded in the browser');
          }
    }
    catch(err){
        console.log(err);
    }
    return page;
}

module.exports = initCookies;