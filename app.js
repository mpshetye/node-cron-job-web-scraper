import cron from 'node-cron';
import ora from 'ora';
import puppeteer from 'puppeteer';
import chalk from 'chalk';

const url = "https://www.worldometers.info/world-population/";

const worldPopulation = async () => {
    console.log(chalk.green("Scheduled job is running..."));
    const spinner = ora({
        text: `Launching ${chalk.red('Puppeteer')}...`,
        color: "blue",
        hideCursor: false
    }).start();

    try {
        const browser = await puppeteer.launch();
        spinner.text = "Launching headless browser page...";
        const newPage = await browser.newPage();
        spinner.text = `Navigating to ${chalk.red('URL')}...`;
        await newPage.goto(url, {waitUntil: "load", timeout: 0});
        spinner.text = "Scraping page...";
        const digitGroups = await newPage.evaluate(()=>{
            const digitGroupsArr = [];
            const selector = "#maincounter-wrap .maincounter-number .rts-counter span";
            const digitSpans = document.querySelectorAll(selector);
            digitSpans.forEach((span)=>{
                if(!isNaN(parseInt(span.textContent))){
                    digitGroupsArr.push(span.textContent);
                }
            });
            return JSON.stringify(digitGroupsArr);
        });
        spinner.text = "Closing headless browser...";
        await browser.close();
        console.log(chalk.yellow.bold(`World population on ${new Date().toISOString()}:`),
        chalk.blue.bold(JSON.parse(digitGroups).join(",")));
    }
    catch (error) {
        spinner.fail({text: chalk.red.bold("Scraping failed")});
        spinner.clear();
        console.log(error);
    }
}

const job = cron.schedule("*/30 * * * * *", worldPopulation);

