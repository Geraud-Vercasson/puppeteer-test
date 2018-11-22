const timeout = 15000;
const fakeUsername = 'JeanMichelTampon';
const fakePassword = 'JeanMichelPassword';
const fakeEmail = 'jeanmichel.tampon@jeanmichel.password';
const baseUrl = 'http://localhost:8000/'; // http://polr.campus-grenoble.fr/

const admin = require('../adminCredentials.json');

// testing registration

describe("Register with new credentials", ()=> {
    let page;

    test(`Register ${fakeUsername}`, async () => {

        await page.goto(baseUrl + 'signup');
        await page.waitForSelector('div.content-div form [name=username]');
        await page.type('div.content-div form [name=username]', fakeUsername);
        await page.waitForSelector('div.content-div form [name=password]');
        await page.type('div.content-div form [name=password]', fakePassword);
        await page.waitForSelector('div.content-div form [name=email]');
        await page.type('div.content-div form [name=email]', fakeEmail);

        await page.screenshot({path: './tests/img/register/register1.png'});

        await page.waitForSelector('div.content-div form [type=submit]');
        await page.$eval('div.content-div form [type=submit]', _ => _.click());

        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/register/register2.png'});
        const html = await page.$eval('.toast-message', _ => _.innerHTML);
        expect(html).toContain('Thanks for signing up!');

    }, timeout);

    test(`Delete ${fakeUsername}`, async () => {
        
        await login(page, admin.username, admin.password, './tests/img/register/delete1.png');
        
        await page.waitForSelector('h1.title');
        await page.screenshot({path: './tests/img/register/logged.png'});
        
        await page.goto(baseUrl + 'admin#admin');
        await page.waitForSelector('#admin_users_table_filter [type=search]');
        await page.screenshot({path: './tests/img/register/waited_search.png'});
        await page.type('#admin_users_table_filter [type=search]', fakeUsername);
        await page.screenshot({path: './tests/img/register/delete2.png'});
        await page.waitFor(1000);
        await page.waitForSelector('#admin_users_table tr:first-child a.btn-danger');
        await page.screenshot({path: './tests/img/register/delete3.png'});
        
        await page.$eval( '#admin_users_table tr:first-child a.btn-danger', _ => _.click() );
        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/register/delete4.png'});
        const html = await page.$eval('.toast-message', _ => _.innerHTML);
        expect(html).toContain('User successfully deleted');
        
        // trying to reconnect
        await login(page, fakeUsername, fakePassword, './tests/img/register/reconnect1.png');
        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/register/reconnect2.png'});
        const html2 = await page.$eval('.toast-message', _ => _.innerHTML);
        expect(html2).toContain('Invalid password or inactivated account. Try again.');
    }, timeout);

    test(`Register ${fakeUsername}% shouldn't work`, async () => {

        await page.goto(baseUrl + 'signup');
        await page.waitForSelector('div.content-div form [name=username]');
        await page.type('div.content-div form [name=username]', fakeUsername + '%');
        await page.waitForSelector('div.content-div form [name=password]');
        await page.type('div.content-div form [name=password]', fakePassword);
        await page.waitForSelector('div.content-div form [name=email]');
        await page.type('div.content-div form [name=email]', fakeEmail);

        await page.screenshot({path: './tests/img/register/failedRegister1.png'});

        await page.waitForSelector('div.content-div form [type=submit]');
        await page.$eval('div.content-div form [type=submit]', _ => _.click());

        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/register/failedRegister2.png'});
        const html = await page.$eval('.toast-message', _ => _.innerHTML);
        expect(html).toContain('Invalid username');

    }, timeout);


    // creation of a browsable page
    beforeAll( async () => {
        page = await global.__BROWSER__.newPage();
        
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }, timeout);
    
});

async function login(page, username, pass, screenshotPath) {
    await page.goto(baseUrl + 'login');
    await page.waitForSelector('div.content-div form [name=username]');
    await page.type('div.content-div form [name=username]', username);
    await page.waitForSelector('div.content-div form [name=password]');
    await page.type('div.content-div form [name=password]', pass);
    await page.screenshot({path: screenshotPath});
    await page.waitForSelector('div.content-div form [type=submit]');
    await page.$eval('div.content-div form [type=submit]', _ => _.click());    
    
}