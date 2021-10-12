const puppeteer = require("puppeteer");

const crawl = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://www.chungbuk.ac.kr/site/www/sub.do?key=1804");

    let data = await page.evaluate(()=>{
        getData: function getData(){
            const data = [];
            const content = document.querySelectorAll(`#contents > div.academic_calendar > ul > li > div:nth-child(2) > div:nth-child(1) > ul > li`);
            for(let i = 0; i < content.length; i++){
                let date = content[i].querySelector("span").textContent;
                let text = content[i].textContent;
                text = text.slice(date.length, text.length);
                date = date.replace(/[^0-9]/g, ".").replace(/\.{2,}/g, ".");
                date = date.slice(1, date.length - 1).split('.');
                data.push({...stringToDate(date), content: text});
            }
            console.log(data);
        }
        stringToDate: function stringToDate(arr){
          const validDate = (i) => { return arr[i].length === 1 ? 0 + arr[i] : arr[i] }
          switch(arr.length){
            case 2:
              return {
                start_date: `2021-${validDate(0)}-${validDate(1)}`,
                end_date: null,
              };
            case 3:
              return {
                start_date: `2021-${validDate(0)}-${validDate(1)}`,
                end_date: `2021-${validDate(0)}-${validDate(2)}`
              };
            case 4:
              return {
                start_date: arr[0].length === 4 ? 
                  (`${arr[0]}-${validDate(1)}-${validDate(2)}`) : 
                  (`2021-${validDate(0)}-${validDate(1)}`),
                end_date: arr[0].length === 4 ? 
                  (`${arr[0]}-${validDate(1)}-${validDate(3)}`) :
                  (`2021-${validDate(2)}-${validDate(3)}`)
              };
            case 5:
              return {
                start_date: arr[0].length === 4 ?
                  (`${arr[0]}-${validDate(1)}-${validDate(2)}`) :
                  (`2021-${validDate(0)}-${validDate(1)}`),
                end_date: arr[0].length === 4 ?
                  (`${arr[0]}-${validDate(3)}-${validDate(4)}`) :
                  (`${arr[2]}-${validDate(3)}-${validDate(4)}`)
              }
          }
        }
        return getData();
    })
  } catch (e) {
    console.log(e);
  }
};

crawl();
