import cron from 'node-cron';
import ora from 'ora';
import puppeteer from 'puppeteer';
import chalk from 'chalk';

const url = "https://www.worldometers.info/world-population/";

const worldPopulation = async () =>{
    console.log(chalk.green("Scheduled job is running..."));
    const spinner = ora({
        text: `Launching ${chalk.red('Puppeteer')}...`,
        color: "blue",
        hideCursor: false
    }).start();

}