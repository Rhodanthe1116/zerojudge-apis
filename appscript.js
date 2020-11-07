var spreadsheet = SpreadsheetApp.getActive();
init();
const root = 'https://asia-east2-quickstart-1583673940423.cloudfunctions.net';

function init() {
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        { name: '同步此工作表', functionName: 'syncCurrentTable' },
        { name: 'Generate step-by-step...', functionName: 'generateStepByStep_' }
    ];
    spreadsheet.addMenu('ZerojudgeHelper', menuItems);
}

function syncManyUserACProblems() {
    const userIdsRange = 'B6:B19'

    const userIds = spreadsheet.getRange(userIdsRange).getValues();
    for (var i = 0; i < userIds.length; i++) {
        const userId = userIds[i][0];
        if (!userId || userId.length < 3) {
            continue;
        } else {

        }
    }
}

function syncCurrentTable() {
    //  const problemRange = 'E5:EA5'
    //  const userIdsRange = 'B6:B9'
    //  const usersProblemRange = 'E6:EA9'
    //  const sessionId = ''

    //  const problemRange = Browser.inputBox('請輸入題目範圍' +
    //      ' (for example, "E5:EA5"):',
    //      Browser.Buttons.OK_CANCEL);
    //  if (problemRange == 'cancel') {
    //    return;
    //  }
    //  const userIdsRange = Browser.inputBox('請輸入user id範圍' +
    //      ' (for example, "B6:B9"):',
    //      Browser.Buttons.OK_CANCEL);
    //  if (userIdsRange == 'cancel') {
    //    return;
    //  }
    //  const usersProblemRange = Browser.inputBox('請輸入user範圍' +
    //      ' (for example, "E6:EA9"):',
    //      Browser.Buttons.OK_CANCEL);
    //  if (usersProblemRange == 'cancel') {
    //    return;
    //  }
    //  const sessionId = Browser.inputBox('若需要，請輸入自備sessionId' +
    //      ' (for example, "CF7E290195EAA05F22AAFF582392FDBF"):',
    //      Browser.Buttons.OK_CANCEL);
    //  if (sessionId == 'cancel') {
    //    return;
    //  }

    const problemRange = spreadsheet.getRange('B1:B1').getValues()[0]
    const userIdsRange = spreadsheet.getRange('B2:B2').getValues()[0]
    const usersProblemRange = spreadsheet.getRange('B3:B3').getValues()[0]
    const sessionId = spreadsheet.getRange('B4:B4').getValues()[0]

    const problemRow = spreadsheet.getRange(problemRange);
    const problems = problemRow.getValues()[0];
    const userIdRows = spreadsheet.getRange(userIdsRange).getValues();
    let userIds = []
    for (var i = 0; i < userIdRows.length; i++) {
        const userId = userIdRows[i][0];
        if (!userId) {
            continue;
        }
        userIds.push(userId);
    }
    const usersACList = getManyUserACProblems(userIds, sessionId);

    let newRows = []
    for (var i = 0; i < userIdRows.length; i++) {
        let newUserACList = [];
        const userId = userIdRows[i][0];
        if (!userId) {
            newRows.push(['e']);
            continue;
        }
        const ACProblems = usersACList[userId];
        for (var j = 0; j < problems.length; j++) {
            if (ACProblems.includes(problems[j])) {
                newUserACList.push('AC');
            } else {
                newUserACList.push('');
            }
        }
        newRows.push([...newUserACList]);
    }
    spreadsheet.getRange(usersProblemRange).setValues(newRows);


}

function syncACProblems() {
    const problemRange = 'E5:EA5'
    const userProblemRange = 'E16:EA16'
    const userRowNumber = Number(16)
    const userIdRange = 'B16:B16'

    const ACProblems = getACProblems();

    const problemRow = spreadsheet.getRange(problemRange);

    const userId = spreadsheet.getRange(userIdRange).getValues()[0];

    var newUserACList = []

    const problems = problemRow.getValues()[0];
    for (var i = 0; i < problems.length; i++) {
        if (ACProblems.includes(problems[i])) {
            newUserACList.push('AC');
        } else {
            newUserACList.push('');
        }
    }

    spreadsheet.getRange(userProblemRange).setValues([newUserACList]);

}


function syncACProblemsWithIdAndRange(userIdRange, problemRange, userProblemRange) {


    const spreadsheet = SpreadsheetApp.getActive();
    const problemRow = spreadsheet.getRange(problemRange);

    const userId = spreadsheet.getRange(userIdRange).getValues()[0];
    const ACProblems = getUserACProblems(userId);

    var newUserACList = []

    const problems = problemRow.getValues()[0];
    for (var i = 0; i < problems.length; i++) {
        if (ACProblems.includes(problems[i])) {
            newUserACList.push('AC');
        } else {
            newUserACList.push('');
        }
    }

    spreadsheet.getRange(userProblemRange).setValues([newUserACList]);

}

function getUserACProblems(userId) {
    const response = UrlFetchApp.fetch(`https://asia-east2-quickstart-1583673940423.cloudfunctions.net/getUserACListWithSession?userId=${userId}`);
    const jsonString = response.getContentText();
    const userACList = JSON.parse(jsonString);


    Logger.log(userACList);
    return userACList;
}


function getManyUserACProblems(userIds, sessionId) {
    const action = '/getUserACListWithSession';

    let query = ''
    for (var i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        query = query.concat(`&userIds[]=${userId}`)
    }
    if (sessionId) {
        query = query.concat(`&sessionId=${sessionId}`)
    }

    const aa = `${root}${action}?${query}`;

    const response = UrlFetchApp.fetch(`${root}${action}?${query}`);
    const jsonString = response.getContentText();
    const usersACList = JSON.parse(jsonString);


    Logger.log(usersACList);
    return usersACList;
}
