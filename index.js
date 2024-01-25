// Importa a biblioteca do puppeteer
const puppeteer = require('puppeteer');
// Importa a biblioteca do Excel
const reader = require('xlsx');
// Importa o método para download do arquivo
const Downloader = require('./downloader')

// Função assíncrona para automatizar o preenchimento dos campos
async function robo() {
    
    // Inicia uma nova página no google chrome
    const browser = await puppeteer.launch({ headless: false, defaultViewport: false });
    const page = await browser.newPage();

    // Navega para site do challenge no URL - https://rpachallenge.com/?lang=EN
    await page.goto('https://rpachallenge.com/?lang=EN');

    // Extrai a URL da planilha do challenge
    const urlXLSX = await page.$eval('[target=_blank]', a => a.href);

    // Faz download do arquivo XLSX com dados
    await new Promise(async (resolve, reject) => {
    
        await Downloader.downloadFile(urlXLSX, function(){
            console.log("Download complete!");
            resolve();
        });
    });

    // Lê o arquivo xlsx
    const file = await reader.readFile('./challenge.xlsx')
    const sheets = await file.Sheets["Sheet1"];

    // Converte pra JSON
    const data = await reader.utils.sheet_to_json(sheets);

    // Clica no Button Start para iniciar o desafio
    await page.click('button')

    // Para cada objeto de dados, preenche os campos e clica em "Submit"
    for(i = 0; i < data.length; i++){

        // Escreve o nome no campo
            await page.type('[ng-reflect-name=labelFirstName]', data[i]["First Name"]);

        // Escreve o sobrenome no campo
            await page.type('[ng-reflect-name=labelLastName]', data[i]["Last Name "]);

        // Escreve o email no campo
            await page.type('[ng-reflect-name=labelEmail]', data[i]["Email"]);

        // Escreve o número de telefone no campo
            await page.type('[ng-reflect-name=labelPhone]', data[i]["Phone Number"].toString());

        // Escreve o nome da compania no campo
            await page.type('[ng-reflect-name=labelCompanyName]', data[i]["Company Name"]);

        // Escreve o role no campo
            await page.type('[ng-reflect-name=labelRole]', data[i]["Role in Company"]);

        // Escreve o endereço no campo
            await page.type('[ng-reflect-name=labelAddress]', data[i]["Address"]);

        // Click no botão submit
            await page.click('[value=Submit]');
    }
};

robo();