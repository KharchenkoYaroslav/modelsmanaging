import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js'; 
import { expect } from 'chai';

const BASE_URL = 'http://localhost:5173';


const WAIT_DEFAULT = 10000; 
const WAIT_LONG = 20000;
const WAIT_PAGE_LOAD = 15000;
const DEMO_DELAY = 500; 

describe('Models and Simulation Flow (Slow Motion)', function () {
    this.timeout(300000); 
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    });

    before(async function () {
        let options = new chrome.Options();
        
        options.addArguments('--lang=en-US'); 
        
        options.addArguments('--disable-blink-features=AutomationControlled');
        
        options.addArguments('--start-maximized');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        if (driver) {
            await driver.sleep(1000);
            await driver.quit();
        }
    });

    const sleep = (ms) => driver.sleep(ms);

    async function login() {
        await driver.get(`${BASE_URL}/auth`);
        await sleep(DEMO_DELAY); 
        
        await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys('testing');
        await sleep(DEMO_DELAY); 

        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('Hello12345#');
        await sleep(DEMO_DELAY); 
        
        const loginBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        await loginBtn.click();

        await driver.wait(until.urlContains('/models'), WAIT_PAGE_LOAD);
        await sleep(DEMO_DELAY);
    }

    async function runSimulationAndVerifyResult(modelName, steps, params, initial, expectedH3Title, visualizationModes) {
        const createBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Create Simulation')]")), WAIT_DEFAULT);
        await createBtn.click();
        await sleep(DEMO_DELAY); 

        await driver.findElement(By.id('model')).click();
        await sleep(500); 
        const option = await driver.wait(until.elementLocated(By.xpath(`//option[text()='${modelName}']`)), WAIT_DEFAULT);
        await option.click();
        await sleep(DEMO_DELAY);

        const stepsInput = await driver.findElement(By.id('steps'));
        await stepsInput.clear();
        await stepsInput.sendKeys(steps);
        await sleep(DEMO_DELAY); 

        for (const key of Object.keys(params)) {
            const input = await driver.findElement(By.id(key));
            await input.clear();
            await input.sendKeys(params[key]);
            await sleep(500); 
        }
        await sleep(DEMO_DELAY);

        const initialInput = await driver.findElement(By.id('initial'));
        await initialInput.clear();
        await initialInput.sendKeys(initial);
        await sleep(DEMO_DELAY);

        const runBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Run Simulation')]"));
        await runBtn.click();

        const h3 = await driver.wait(until.elementLocated(By.xpath(`//h3[contains(text(), '${expectedH3Title}')]`)), WAIT_DEFAULT);
        expect(await h3.isDisplayed()).to.be.true;
        await sleep(DEMO_DELAY); 

        for (const mode of visualizationModes) {
            const modeBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'info-column')]//button[contains(text(), '${mode}')]`));
            await modeBtn.click();

            const plot = await driver.wait(until.elementLocated(By.className('plot-wrapper')), WAIT_LONG);
            expect(await plot.isDisplayed()).to.be.true;
            
            await sleep(1500); 
        }
    }

    it('should display the Models page title and navigate to History', async function () {
        await login();

        let h2 = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Create New Simulation')]")), WAIT_DEFAULT);
        expect(await h2.isDisplayed()).to.be.true;
        await sleep(DEMO_DELAY);

        await driver.findElement(By.xpath("//button[contains(text(), 'History')]")).click();
        h2 = await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Simulation History')]")), WAIT_DEFAULT);
        expect(await h2.isDisplayed()).to.be.true;
        await sleep(DEMO_DELAY); 

        await driver.findElement(By.xpath("//button[contains(text(), 'Create Simulation')]")).click();
        await sleep(DEMO_DELAY);
    });

    it('should successfully run a Henon Map simulation and check 2D plots', async function () {
        await runSimulationAndVerifyResult(
            'Henon Map',
            '1000',
            { a: '1.4', b: '0.3' },
            '0.1, 0.3',
            'Henon Map Simulation',
            ['X-Y', 'X-T', 'Y-T']
        );
    });

    it('should successfully run a Lorenz Attractor simulation and check 2D/3D plots', async function () {
        await runSimulationAndVerifyResult(
            'Lorenz Attractor',
            '1000',
            { sigma: '10', rho: '28', beta: '2.6666666666666665', dt: '0.01' },
            '1, 1, 1',
            'Lorenz Attractor Simulation',
            ['X-Y', 'X-T', 'Y-T', 'Z-T', '3D']
        );
    });

    it('should successfully run a Thomas Attractor simulation and check 2D/3D plots', async function () {
        await runSimulationAndVerifyResult(
            'Thomas Attractor',
            '1000',
            { b: '0.18', dt: '0.01' },
            '0, 0, 1',
            'Thomas Attractor Simulation',
            ['X-Y', 'X-T', 'Y-T', 'Z-T', '3D']
        );
    });
});