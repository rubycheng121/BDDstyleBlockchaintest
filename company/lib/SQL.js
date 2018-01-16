var mysql = require('mysql')
var credentials = require("./credentials.js")

var connection = mysql.createConnection({
    host: credentials.SQL.host,
    user: credentials.SQL.user,
    password: credentials.SQL.password,
    database: credentials.SQL.database
})

////AB公司
//A公司
//登入
async function sing_inA(account, password) {
    try {
        let user = await getUserByAccountA(account)
        console.log(user)
        if (user) {
            if (user.password == password) {
                return { type: 1, inf: '登入成功', points: user.loyaltypoint, address: user.address }
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
async function sing_upA(account, password, address) {
    try {
        let user = await getUserByAccountA(account)
        if (!user) {
            let result = await addUser(account, password, address)
            return { type: 1, inf: '註冊成功' }
        } else {
            return { type: 2, inf: '此帳號已有人註冊過' }
        }
    } catch (err) {
        console.error(err)
    }

    //新增使用者
    function addUser(account, password, address) {
        let cmd = "INSERT INTO companya (account, password, address) VALUES ?"
        let value = [[[account, password, address]]]
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
function getUserByAccountA(account) {
    var cmd = "SELECT * FROM companya WHERE account = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [account], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}
//B公司
//登入
async function sing_inB(account, password) {
    try {
        let user = await getUserByAccountB(account)

        if (user) {
            if (user.password == password) {
                return { type: 1, inf: '登入成功', points: user.loyaltypoint, address: user.address }
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
async function sing_upB(account, password, address) {
    try {
        let user = await getUserByAccountB(account)

        if (!user) {
            let result = await addUser(account, password, address)
            return { type: 1, inf: '註冊成功' }
        } else {
            return { type: 2, inf: '此帳號已有人註冊過' }
        }
    } catch (err) {
        console.error(err)
    }

    //新增使用者
    function addUser(account, password, address) {
        let cmd = "INSERT INTO companyb (account, password, address) VALUES ?"
        let value = [[[account, password, address]]]
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
function getUserByAccountB(account) {
    var cmd = "SELECT * FROM companyb WHERE account = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [account], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        })
    })
}

module.exports = {
    connection,

    sing_inA: sing_inA,
    sing_inB: sing_inB,
    sing_upA: sing_upA,
    sing_upB: sing_upB,

    getUserByAccountA: getUserByAccountA,
    getUserByAccountB: getUserByAccountB
}