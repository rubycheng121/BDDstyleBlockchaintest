var mysql = require('mysql')
var moment = require('moment')
var SHA256 = require("crypto-js/sha256");
var credentials = require("./credentials.js")

var connection = mysql.createConnection({
    host: credentials.SQL.host,
    user: credentials.SQL.user,
    password: credentials.SQL.password,
    database: credentials.SQL.database
})

//登入
async function sing_in(ID, password) {
    try {
        let user = await getUserByID(ID) || await getUserByEmail(ID)

        if (user) {
            if (user.password == SHA256(password + credentials.salt)) {
                return { type: 1, inf: '登入成功', user: user }
            } else {
                return { type: 2, inf: '密碼錯誤' }
            }
        } else {
            return { type: 0, inf: '查無此帳號' }
        }
    } catch (err) {
        console.error(err)
    }
}

//註冊
async function sing_up(ID, password, email) {
    try {
        let user = await getUserByID(ID)

        if (!user) {
            let result = await addUser(ID, password, email)
            return { type: true, inf: '註冊成功' }
        } else {
            return { type: false, inf: '此帳號已有人註冊過' }
        }
    } catch (err) {
        console.error(err)
    }

    //新增使用者
    function addUser(ID, password, email) {
        let cmd = "INSERT INTO user (ID, password, email, api_key) VALUES ?"
        let value = [[[ID, SHA256(password + credentials.salt), email, generateApiKey()]]]
        return new Promise(function (resolve, reject) {
            connection.query(cmd, value, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    }
}

//更新密碼
async function update_password(ID, password) {
    let cmd = "UPDATE user SET password = ? WHERE ID = ?"
    password = SHA256(password + credentials.salt).toString()
    console.log(password)
    let value = [password, ID]
    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                console.error(err)
                reject(err)
            }
        })
    })
}

//更新API KEY
async function reGenerateApiKey(ID) {
    let cmd = "UPDATE user SET api_key = ? WHERE ID = ?"
    let api_key = generateApiKey()
    let value = [api_key, ID]
    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(api_key)
            } else {
                console.error(err)
                reject(err)
            }
        })
    })
}
function generateApiKey() {
    return Math.random().toString(36).substring(3)
}

//由ID取得user
function getUserByID(ID) {
    var cmd = "SELECT * FROM user WHERE ID = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}

//由email取得user
function getUserByEmail(email) {
    var cmd = "SELECT * FROM user WHERE email = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [email], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}

//由api_key取得user
function getUserByApiKey(api_key) {
    var cmd = "SELECT * FROM user WHERE api_key = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [api_key], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}

//取得api key
function getApiKeyByID(ID) {
    var cmd = "SELECT api_key FROM user WHERE ID = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
            if (!err) {
                resolve(result[0].api_key)
            } else {
                reject(err)
            }
        })
    })
}

//取得專案列表
function get_project_list(ID) {
    var cmd = "SELECT project, create_date, last_update FROM project WHERE ID = ?"
    var value = [ID]

    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

//取得專案
function get_project(ID, project_name) {
    var cmd = "SELECT * from project where ID = ? and project = ?"
    var value = [ID, project_name]

    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}

//新增專案
async function new_project(ID, project_name, contract) {

    let project = await get_project(ID, project_name)

    if (!project) {

        let cmd = "INSERT INTO project (ID, project, contract, feature, stepDefinitions, solidity, mocha, create_date, last_update) VALUES ?"
        let date = moment().format('YYYY-MM-DD hh:mm:ss')
        let value = [[[ID, project_name, contract, "", "", "", "", date, date]]]

        return new Promise(function (resolve, reject) {
            connection.query(cmd, value, (err, result) => {
                if (!err) {
                    resolve({ type: 1, inf: '新增專案成功' })
                } else {
                    reject(err)
                }
            })
        })

    } else {
        return { type: 0, inf: "你已經使用過此project name" }
    }
}

//刪除專案
function delete_project(ID, project) {
    var cmd = "DELETE FROM project WHERE ID = ? AND project = ?"
    var value = [ID, project]

    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

//修改專案
function update_project(ID, project, feature, stepDefinitions, solidity, mocha, step) {
    var cmd = "UPDATE project SET feature = ?, stepDefinitions = ?, solidity = ?, mocha = ?, step = ?, last_update = ? WHERE ID = ? and project = ?"
    let date = moment().format('YYYY-MM-DD hh:mm:ss')
    var value = [feature, stepDefinitions, solidity, mocha, step, date, ID, project]

    return new Promise(function (resolve, reject) {
        connection.query(cmd, value, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

module.exports = {

    connection: connection,

    sing_in: sing_in,
    sing_up: sing_up,
    update_password,
    reGenerateApiKey,

    getUserByID: getUserByID,
    getUserByApiKey: getUserByApiKey,
    getApiKeyByID: getApiKeyByID,

    get_project_list: get_project_list,
    get_project: get_project,

    new_project: new_project,
    delete_project: delete_project,
    update_project: update_project
}