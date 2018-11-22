const timeout = 15000;
const fakeUsername = 'JeanMichelTampon';
const fakePassword = 'JeanMichelPassword';
const fakeEmail = 'jeanmichel.tampon@jeanmichel.password';
const baseUrl = 'http://localhost:8000/'; // http://polr.campus-grenoble.fr/
const testUrl = 'https://www.google.com';

const admin = require('../adminCredentials.json');

// testing registration

describe("Clicking links", ()=> {
    let page;
    
    test(`Click twice on link`, async () => {
        
        await login(page, fakeUsername, fakePassword);
        await page.goto(baseUrl);
        await page.waitForSelector('.long-link-input')
        await page.type('.long-link-input', testUrl);
        await page.screenshot({path: './tests/img/click/shortened.png'});
        await page.waitForSelector('#shorten');
        await page.$eval( '#shorten', el => el.click() );
        await page.waitForSelector('#short_url');
        const val = await page.$eval('#short_url', el => el.value);
        
        await login(page, fakeUsername, fakePassword);
        await page.goto(baseUrl + 'admin#links');
        await page.waitForSelector('#user_links_table tbody tr:first-child td:nth-child(3)');
        await page.screenshot({path: './tests/img/click/links1.png'});
        const initialClicks = Number(await page.$eval('#user_links_table tbody tr:first-child td:nth-child(3)', el => el.textContent));

        await page.goto(val);
        await login(page, fakeUsername, fakePassword);
        await page.goto(baseUrl + 'admin#links');
        await page.waitForSelector('#user_links_table tbody tr:first-child td:nth-child(3)');
        await page.screenshot({path: './tests/img/click/links1.png'});
        let clicks = await page.$eval('#user_links_table tbody tr:first-child td:nth-child(3)', el => el.textContent);
        
        expect(clicks).toEqual((initialClicks + 1).toString());
        
        await page.goto(val);
        await login(page, fakeUsername, fakePassword);
        await page.goto(baseUrl + 'admin#links');
        await page.waitForSelector('#user_links_table tbody tr:first-child td:nth-child(3)');
        clicks = await page.$eval('#user_links_table tbody tr:first-child td:nth-child(3)', el => el.textContent);
        
        await page.screenshot({path: './tests/img/click/links2.png'});
        
        expect(clicks).toEqual((initialClicks + 2).toString());

        // await page.goto(baseUrl + 'admin#admin');
        // await page.waitForSelector('#admin_links_table_wrapper [type=search]');
        // await page.type('#admin_links_table_wrapper [type=search]', fakeUsername);
        // await page.screenshot({path: './tests/img/click/delete2.png'});
        // await page.waitFor(1000);
        // await page.waitForSelector('#admin_users_table tr:first-child a.btn-danger');
        // await page.screenshot({path: './tests/img/click/delete3.png'});
        
        // await page.$eval( '#admin_users_table tr:first-child a.btn-danger', _ => _.click() );
        // await page.waitForSelector('.toast-message');
        // await page.screenshot({path: './tests/img/click/delete4.png'});
        // const html = await page.$eval('.toast-message', _ => _.innerHTML);
        // expect(html).toContain('User successfully deleted');
        


    }, timeout);
    
    // creation of a browsable page
    beforeAll( async () => {
        page = await global.__BROWSER__.newPage();
        await create(page, fakeUsername, fakePassword, fakeEmail);
        await page.screenshot({path: './tests/img/click/createUser.png'});
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }, timeout);
    
    afterAll( async () => {
        await deleteUser(page, fakeUsername);
        await page.screenshot({path: './tests/img/click/deleteUser.png'});
    }, timeout);
});

async function login(page, username, pass) {
    await page.goto(baseUrl + 'login');
    await page.waitForSelector('div.content-div form [name=username]');
    await page.type('div.content-div form [name=username]', username);
    await page.waitForSelector('div.content-div form [name=password]');
    await page.type('div.content-div form [name=password]', pass);
    await page.waitForSelector('div.content-div form [type=submit]');
    await page.$eval('div.content-div form [type=submit]', _ => _.click());    
    
}

async function create(page, fakeUsername, fakePassword, fakeEmail) {
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
}

async function deleteUser(page, fakeUsername) {
    await login(page, admin.username, admin.password, './tests/img/register/delete1.png');
        
    await page.waitForSelector('h1.title');
    
    await page.goto(baseUrl + 'admin#admin');
    await page.waitForSelector('#admin_users_table_filter [type=search]');
    await page.type('#admin_users_table_filter [type=search]', fakeUsername);
    await page.waitFor(1000);
    await page.waitForSelector('#admin_users_table tr:first-child a.btn-danger');
    await page.screenshot({path: './tests/img/register/delete3.png'});
    
    await page.$eval( '#admin_users_table tr:first-child a.btn-danger', _ => _.click() );
    await page.waitForSelector('.toast-message');
}