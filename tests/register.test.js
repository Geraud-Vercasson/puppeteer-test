const timeout = 15000;
const fakeUsername = 'JeanMichelTampon';
const fakePassword = 'JeanMichelPassword';
const fakeEmail = 'jeanmichel.tampon@jeanmichel.password';

const admin = require('../adminCredentials.json');

// testing registration

describe("Register with new credentials", ()=> {
    let page;

    test(`Register ${fakeUsername}`, async () => {

        await page.goto('http://polr.campus-grenoble.fr/signup');
        await page.waitForSelector('div.content-div form [name=username]');
        await page.type('div.content-div form [name=username]', fakeUsername);
        await page.waitForSelector('div.content-div form [name=password]');
        await page.type('div.content-div form [name=password]', fakePassword);
        await page.waitForSelector('div.content-div form [name=email]');
        await page.type('div.content-div form [name=email]', fakeEmail);

        await page.screenshot({path: './tests/img/register1.png'});

        await page.waitForSelector('div.content-div form [type=submit]');
        await page.$eval('div.content-div form [type=submit]', _ => _.click());

        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/register2.png'});

    }, timeout);

    test(`Delete ${fakeUsername}`, async () => {
        await page.goto('http://polr.campus-grenoble.fr/login');
        await page.waitForSelector('div.content-div form [name=username]');
        await page.type('div.content-div form [name=username]', admin.username);
        await page.waitForSelector('div.content-div form [name=password]');
        await page.type('div.content-div form [name=password]', admin.password);

        await page.screenshot({path: './tests/img/delete1.png'});

        await page.waitForSelector('div.content-div form [type=submit]');
        await page.$eval('div.content-div form [type=submit]', _ => _.click());
        await page.waitForSelector('h1.title');
        await page.screenshot({path: './tests/img/logged.png'});

        await page.goto('http://polr.campus-grenoble.fr/admin#admin');
        await page.waitForSelector('#admin_users_table_filter [type=search]');
        await page.screenshot({path: './tests/img/waited_search.png'});
        await page.type('#admin_users_table_filter [type=search]', fakeUsername);
        await page.screenshot({path: './tests/img/delete2.png'});
        await page.waitFor(1000);
        await page.waitForSelector('#admin_users_table tr:first-child a.btn-danger');
        await page.screenshot({path: './tests/img/delete3.png'});

        await page.$eval( '#admin_users_table tr:first-child a.btn-danger', _ => _.click() );
        await page.waitForSelector('.toast-message');
        await page.screenshot({path: './tests/img/delete4.png'});

    }, timeout);
    // creation of a browsable page
    beforeAll( async () => {
        page = await global.__BROWSER__.newPage();

        page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }, timeout);

});

