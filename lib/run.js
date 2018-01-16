const exec = require('child_process').exec;
const fs = require('fs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8546'))
const solc = require('solc')

//執行cucumber
async function cucumber(ID, feature, stepDef) {

    let cmd = `shell/s.sh ${ID}`
    let next = await findfunc(stepDef)
    let head = `const { defineSupportCode } = require('cucumber');
    const assert = require('assert');
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8546'));\n\n`

    await fs.writeFileSync(`temp/${ID}/s/step_definitions/test.js`, head + stepDef)
    await fs.writeFileSync(`temp/${ID}/s/test.feature`, feature)

    return new Promise(function (resolve, reject) {
        exec(cmd, async function (error, stdout, stderr) {
            if (error) {
		console.log(error)
                reject(error)
            }
            else {
                let r = await fs.readFileSync(`temp/${ID}/s/r.txt`).toString()
                let err = await fs.readFileSync(`temp/${ID}/s/r.err`).toString()
                //執行js有語法錯誤
                if (err) {
                    let end = {
                        success: false,
                        output: r + err,
                    }
                    resolve(end)
                }
                let a = await r.match(/\d+ scenario/)[0].match(/\d+/)[0]
                let b = await r.match(/\d+ step/)[0].match(/\d+/)[0]
                let c = b / a;
		let status = false;
		if(r.match(/\d+ step(.*)/)){
		    status = (r.match(/\d+ step(.*)/)[0].match(/failed/) || r.match(/\d+ step(.*)/)[0].match(/undefined/)) ? false : true;
		}
                console.log(status)
                let end = {
                    success: true,
                    status: status,
                    next: next,
                    output: r,
                    setinput: r.slice(r.indexOf('1) Scenario: '), r.indexOf('' + (c + 1) + ') Scenario: '))
                        .replace(/\[.*?[Hm]/g, '')
                        .replace(/\d+\) Scenario(.*\n)(.*\n)(.*\n)(.*\n)/mg, '')
                        .replace(/\d+ scenario(.*\n)/, "")
                        .replace(/\d+ step(.*\n)/, "")
                        .replace(/\d+m\d+\.\d+s/, "")
                }
                resolve(end)
            }
        })
    })
}

//執行mocha
async function mocha(ID, mocha, code) {

    let cmd = `shell/m.sh ${ID}`
    let next = await findfunc(mocha)
    let head = "const assert = require('assert');\nconst Web3 = require('web3');\nconst web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8546'));\n\n";

    await fs.writeFileSync(`temp/${ID}/m/test/test.js`, head + mocha);
    await fs.writeFileSync(`temp/${ID}/m/test/code.js`, code);

    return new Promise(function (resolve, reject) {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error)
            }
            else {
                let mr = fs.readFileSync(`temp/${ID}/m/mr.txt`).toString()
                let err = fs.readFileSync(`temp/${ID}/m/mr.err`).toString()
                if (err) {
                    let end = {
                        success: false,
                        output: mr + err,
                    }
                    reject(end)
                }
		let status = false;
		if(mr.match(/\d+ passing(.*)\n(.*)/)){
		    status = (mr.match(/\d+ passing(.*)\n(.*)/)[0].match(/failing/)) ? false : true;
		}
                console.log(status)
                let end = {
                    success: true,
                    status: status,
                    next: next,
                    output: mr,
                }
                resolve(end)
            }
        })
    })
}

//編譯合約
async function compile(solidity) {

    let info = []
    let source = solidity

    let compiledContract = solc.compile(source, 1)
    let account = await web3.eth.getCoinbase()
    return new Promise(async function (resolve, reject) {

        if (compiledContract.hasOwnProperty('errors')) {
            let end = {
                success: false,
                errors: compiledContract.errors
            }
            reject(end)
        }

        for (var index in compiledContract.contracts) {
            let gas
            await web3.eth.estimateGas({
                data: compiledContract.contracts[index].bytecode
            }).then((result) => {
                info.push({
                    'name': index,
                    'abi': compiledContract.contracts[index].interface,
                    'bytecode': compiledContract.contracts[index].bytecode,
                    'deploy_gas': result,
                    'gas': compiledContract.contracts[index].gasEstimates,
                })
            })
        }
        let end = {
            success: true,
            info: info,
            account: account
        }
        resolve(end)
    })
}

//尋找'///@method'
var findfunc = (s) => {
    let next = [];
    if (s.length != 0) {
        let ss = s.match(/\/\/\/@method( *)\{(.*)\}/mg);
        if (ss) {
            ss.forEach(function (element) {
                let json_string = element.replace(/\/\/\/\@method( *)/, '')
                let json = JSON.parse(json_string)
                next.push([element, makefunc(json)]);
            }, this);
        }
    }
    return next
}

//製作下一步驟的method
var makefunc = (n) => {
    let func = '';
    func += n.contract + '_contract.methods.' + n.name + '('
    for (let i = 1; i <= n.argument; i++) {
        func += 'arg' + i + ','
    }
    func = func.replace(/\,$/, '') + ')'
    return func
}

module.exports = {
    cucumber: cucumber,
    mocha: mocha,
    compile: compile
}
