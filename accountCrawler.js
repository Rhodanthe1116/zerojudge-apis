const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// googleLogin();
// main(['101529', '37506', '132600'], null);

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getUserACList = (req, res) => {

    const userIds = req.query.userIds
    const sessionId = req.query.sessionId
    console.log(userIds, sessionId)
    if (!userIds) {
        res.status(400).send('Please input userId');
    }

    main(userIds, sessionId).then((result) => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send(err.toString());
    })
};

async function main(userIds, sessionId) {

    const account = process.env.USERNAME
    const passwd = process.env.PASSWORD

    try {

        if (sessionId) {
            console.log(`sessionId ${sessionId} is given, trying crawling...`)
            const usersACList = await getUsersACList(userIds, sessionId);
            if (usersACList) {
                return usersACList
            }
        }
    } catch (error) {
        console.log('Given sessionId failed.')
        console.log('Error: ' + error)
        throw error
    }

    let newSessionId = null;

    try {

        console.log(`sessionId ${sessionId} is not given or failed, trying to login...`)
        const newSession = await login(account, passwd)
        newSessionId = newSession.sessionId;
        console.log(sessionId)
    } catch (error) {
        console.log('Error: ' + error)
        console.log(newSessionId)
        const res = await logout(newSessionId)
        console.log(res)
        throw new Error(`sessionId ${sessionId} is not given or failed. Tried to login but failed`)
        throw error
    }

    try {   
        const usersACList = await getUsersACList(userIds, newSessionId);

        console.log('success, logout')
        const res = await logout(newSessionId)
        console.log(res)

        return usersACList
    } catch (error) {
        console.log('Error getting users AC list: ' + error)
        console.log(newSessionId)
        const res = await logout(newSessionId)
        console.log(res)
        throw error
    }


}

async function getUsersACList(userIds, sessionId) {
    let usersACList = {}
    for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        usersACList[userId] = await getUserACListWithSession(userId, sessionId);
    }
    return usersACList
}

async function getUserStatics(userId) {

    const root = 'https://zerojudge.tw'
    const action = `/UserStatistic?id=${userId}`
    const requestUrl = `${root}${action}`

    try {
        const response = await fetch(requestUrl, {
            headers: {
                cookie: `JSESSIONID=${sessionId}`
            }
        });



        // const jsonResponse = await response.json()
        if (response.status < 200 || response.status >= 300) {
            const type = jsonResponse.type
            const title = jsonResponse.title
            throw new Error(`${response.status} ${response.statusText}, ${type}, ${title}`);
        }

        const textResponse = await response.text()
        // console.log(textResponse)
        if (textResponse) {
            const selector = 'body > div.container > div > div.col-md-9'
            const ACSelector = '.acstyle'

            const dom = new JSDOM(textResponse);

            const textResult = dom.window.document.querySelector(selector)
            const ResultHtml = dom.serialize()
            // console.log(textResult);


            const problemNodeList = dom.window.document.querySelectorAll(ACSelector)
            const problemList = Array.from(problemNodeList).map((p) => p.textContent);

            return problemList
        }

    } catch (error) {
        console.log('Error logging: ' + error)
        throw error;
    }

}


async function getUserACListWithSession(userId, sessionId) {

    const root = 'https://zerojudge.tw'
    const action = `/UserStatistic?id=${userId}`
    const requestUrl = `${root}${action}`

    try {
        const response = await fetch(requestUrl, {
            headers: {
                cookie: `JSESSIONID=${sessionId}`
            }
        });

        if (!response.ok) {
            const type = jsonResponse.type
            const title = jsonResponse.title
            throw new Error(`${response.status} ${response.statusText}, ${type}, ${title}`);
        }

        if (response.redirected) {
            throw new Error(`${response.status} ${response.statusText}, sessionId incorrect`);
        }

        const textResponse = await response.text()
        if (textResponse) {
            const selector = 'body > div.container > div > div.col-md-9'
            const ACSelector = '.acstyle'

            const virtualConsole = new jsdom.VirtualConsole();
            virtualConsole.sendTo(console, { omitJSDOMErrors: true });
            const dom = new JSDOM(textResponse, { virtualConsole });

            const problemNodeList = dom.window.document.querySelectorAll(ACSelector)
            const problemList = Array.from(problemNodeList).map((p) => p.textContent);
            return problemList
        }

    } catch (error) {
        console.log('Error getUserACListWithSession: ' + error)
        throw error;
    }

}


async function googleLogin() {
    const root = 'https://zerojudge.tw'
    const googleAccount = ''
    const googlePassword = ''

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4272.0 Safari/537.36'
    try {

        await page.goto(`${root}/Login`);
        await page.click('body > div.container > div:nth-child(2) > div.col-md-4.text-center > a:nth-child(3)')

        console.log('Google logging...')

        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', googleAccount);
        await page.click("#identifierNext");

        await page.waitForSelector('input[type="password"]', { visible: true });
        await page.type('input[type="password"]', googlePassword);

        await page.waitForSelector("#passwordNext", { visible: true });
        await page.click("#passwordNext");

        console.log('Google logging success')

        const sessionId = response.headers.get('set-cookie').split(';')[0].split('=')[1]

        console.log(sessionId)
        return {
            sessionId: sessionId
        }

    } catch (error) {
        await page.screenshot({ path: 'screenshot.png' });
        // console.log(await page.content());
        console.log('Error logging: ' + error)
        throw error;
    }
}

async function login(account, passwd, returnPage = '/Index', token = '') {

    const root = 'https://zerojudge.tw'
    const action = `/Login`
    const requestUrl = `${root}${action}`
    let formData = new URLSearchParams()
    formData.append('account', account)
    formData.append('passwd', passwd)
    formData.append('returnPage', returnPage)
    formData.append('token', token)

    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            body: formData,
        })

        let jsonResponse = null
        const sessionId = response.headers.get('set-cookie').split(';')[0].split('=')[1]

        console.log(sessionId)

        if (response.status < 200 || response.status >= 300) {
            jsonResponse = await response.json()
            const type = jsonResponse.type
            const title = jsonResponse.title
            throw new Error(`${response.status} ${response.statusText}, ${type}, ${title}`);
        }

        return {
            sessionId: sessionId
        }

    } catch (error) {
        console.log('Error logging: ' + error)
        throw error;
    }
}

async function logout(sessionId) {

    const root = 'https://zerojudge.tw'
    const action = `/Logout`

    const requestUrl = `${root}${action}`

    try {
        console.log(`logouting with sessionId: ${sessionId}`)
        const response = await fetch(requestUrl, {
            headers: {
                cookie: `JSESSIONID=${sessionId}`
            }
        })

        if (response.status < 200 || response.status >= 300) {
            const jsonResponse = await response.json()
            const type = jsonResponse.type
            const title = jsonResponse.title
            throw new Error(`${response.status} ${response.statusText}, ${type}, ${title}`);
        }

        return true;


    } catch (error) {
        console.log('Error logout: ' + error)
        throw error;
    }
}

