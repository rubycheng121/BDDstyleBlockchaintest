const express = require('express')
const session = require('express-session')
const router = express.Router()

const sql = require('../lib/SQL')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

sql.connection.connect(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
        // 2秒後重新連線
        //setTimeout(handleDisconnect, 2000);
    }
})

let isSignA = function (req, res, next) {
    if (req.session.A_ID) { next() }
    else { res.redirect('/companyA') }
}
let isSignB = function (req, res, next) {
    if (req.session.B_ID) { next() }
    else { res.redirect('/companyB') }
}

//company頁面
router.get('/companyA', async function (req, res, next) {
    res.render('companyA', { A_ID: req.session.A_ID })
})
router.get('/companyB', async function (req, res, next) {
    res.render('companyB', { B_ID: req.session.B_ID })
})

//person頁面
router.get('/personA', isSignA, async function (req, res, next) {
    let account_abi = [{ "constant": false, "inputs": [{ "name": "_companyName", "type": "bytes32" }, { "name": "points", "type": "int256" }, { "name": "rate", "type": "uint256" }], "name": "addLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getCompanyName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "getLocalLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "getLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_companyName", "type": "bytes32" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
    let account = new web3.eth.Contract(account_abi, req.session.A_address)
    //取得A公司點數
    account.methods.getLocalLoyaltyPoint().call().then((address) => {
        let abi = [{ "constant": true, "inputs": [], "name": "getName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "amount", "type": "int256" }], "name": "addPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "setPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getPoints", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_points", "type": "int256" }, { "name": "_rate", "type": "uint256" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
        let point = new web3.eth.Contract(abi, address)
        point.methods.getPoints().call().then((pointsA) => {
            //取得B公司點數
            account.methods.getLoyaltyPoint('002').call().then((address) => {
                let point2 = new web3.eth.Contract(abi, address)
                point2.methods.getPoints().call().then((pointsB) => {
                    res.render('personA', { A_ID: req.session.A_ID, AA_points: pointsA, AB_points: pointsB })
                })
            })
        })
    })
})
router.get('/personB', isSignB, async function (req, res, next) {
    let account_abi = [{ "constant": false, "inputs": [{ "name": "_companyName", "type": "bytes32" }, { "name": "points", "type": "int256" }, { "name": "rate", "type": "uint256" }], "name": "addLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getCompanyName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "getLocalLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "getLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_companyName", "type": "bytes32" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
    let account = new web3.eth.Contract(account_abi, req.session.B_address)
    //取得B公司點數
    account.methods.getLocalLoyaltyPoint().call().then((address) => {
        console.log(address)
        let abi = [{ "constant": true, "inputs": [], "name": "getName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "amount", "type": "int256" }], "name": "addPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "setPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getPoints", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_points", "type": "int256" }, { "name": "_rate", "type": "uint256" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
        let point = new web3.eth.Contract(abi, address)
        point.methods.getPoints().call().then((pointsB) => {
            //取得A公司點數
            account.methods.getLoyaltyPoint('001').call().then((address) => {
                console.log(address)
                let point2 = new web3.eth.Contract(abi, address)
                point2.methods.getPoints().call().then((pointsA) => {
                    res.render('personB', { B_ID: req.session.B_ID, BB_points: pointsB, BA_points: pointsA })
                })
            })
        })
    })
})

//註冊
router.post('/signupA', async function (req, res, next) {
    let address = await deployAccount('companyA')
    let result = await sql.sing_upA(req.body.account, req.body.password, address)
    res.send(result)
})
router.post('/signupB', async function (req, res, next) {
    let address = await deployAccount('companyB')
    let result = await sql.sing_upB(req.body.account, req.body.password, address)
    res.send(result)
})

//登入
router.post('/signinA', async function (req, res, next) {
    let result = await sql.sing_inA(req.body.account, req.body.password)
    if (result.type == 1) {
        req.session.A_ID = req.body.account
        req.session.A_address = result.address
    }
    res.send(result)
})
router.post('/signinB', async function (req, res, next) {
    let result = await sql.sing_inB(req.body.account, req.body.password)
    if (result.type == 1) {
        req.session.B_ID = req.body.account
        req.session.B_address = result.address
    }
    res.send(result)
})
//登出
router.get('/signoutA', function (req, res, next) {
    delete req.session.A_ID
    delete req.session.A_address
    res.redirect('/companyA')
})
router.get('/signoutB', function (req, res, next) {
    delete req.session.B_ID
    delete req.session.B_address
    res.redirect('/companyB')
})

//交換
router.post('/A2B', async function (req, res, next) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let user = await sql.getUserByAccountB(req.body.account)
    if (user) {
        let address = await deployExchange(req.session.A_address, user.address)
        let abi = [{ "constant": true, "inputs": [], "name": "getPartnerAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "sourceName", "type": "bytes32" }, { "name": "targetName", "type": "bytes32" }, { "name": "amount", "type": "int256" }], "name": "to", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "me", "type": "address" }, { "name": "partner", "type": "address" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "test", "type": "bool" }], "name": "testFunctionRun", "type": "event" }]
        let exchange = new web3.eth.Contract(abi, address)
        exchange.methods.to('001', '002', req.body.points).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }).then(function () {
            res.send('successfully')
        })
    }
})
router.post('/B2A', async function (req, res, next) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let user = await sql.getUserByAccountA(req.body.account)
    if (user) {
        let address = await deployExchange(req.session.B_address, user.address)
        let abi = [{ "constant": true, "inputs": [], "name": "getPartnerAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "sourceName", "type": "bytes32" }, { "name": "targetName", "type": "bytes32" }, { "name": "amount", "type": "int256" }], "name": "to", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "me", "type": "address" }, { "name": "partner", "type": "address" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "test", "type": "bool" }], "name": "testFunctionRun", "type": "event" }]
        let exchange = new web3.eth.Contract(abi, address)
        exchange.methods.to('002', '001', req.body.points).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }).then(function () {
            res.send('successfully')
        })
    }
})

//增加點數
router.post('/addPointA', async function (req, res, next) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let account_abi = [{ "constant": false, "inputs": [{ "name": "_companyName", "type": "bytes32" }, { "name": "points", "type": "int256" }, { "name": "rate", "type": "uint256" }], "name": "addLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getCompanyName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "getLocalLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "getLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_companyName", "type": "bytes32" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
    let account = new web3.eth.Contract(account_abi, req.session.A_address)
    account.methods.getLocalLoyaltyPoint().call().then((address) => {
        let abi = [{ "constant": true, "inputs": [], "name": "getName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "amount", "type": "int256" }], "name": "addPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "setPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getPoints", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_points", "type": "int256" }, { "name": "_rate", "type": "uint256" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
        let point = new web3.eth.Contract(abi, address)
        point.methods.addPoints(100).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }).then(function () {
            res.send('successfully')
        })
    })
})
router.post('/addPointB', async function (req, res, next) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let account_abi = [{ "constant": false, "inputs": [{ "name": "_companyName", "type": "bytes32" }, { "name": "points", "type": "int256" }, { "name": "rate", "type": "uint256" }], "name": "addLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getCompanyName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "getLocalLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "getLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_companyName", "type": "bytes32" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
    let account = new web3.eth.Contract(account_abi, req.session.B_address)
    account.methods.getLocalLoyaltyPoint().call().then((address) => {
        let abi = [{ "constant": true, "inputs": [], "name": "getName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "amount", "type": "int256" }], "name": "addPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "setPoints", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getPoints", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_points", "type": "int256" }, { "name": "_rate", "type": "uint256" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
        let point = new web3.eth.Contract(abi, address)
        point.methods.addPoints(100).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }).then(function () {
            res.send('successfully')
        })
    })
})

//部屬Account
async function deployAccount(company) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let companyNum = ((company == 'companyA') ? '001' : '002')
    let address
    let bytecode = '0x60606040523461000057604051602080610852833981016040528080519060200190919050505b60008160008160001916905550600054600060646040516102278061062b8339018084600019166000191681526020018381526020018281526020019350505050604051809103906000f0801561000057905080600160006000546000191660001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50505b610543806100e86000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318e486221461005f57806343cfbd65146100d2578063a8753d58146100fd578063bbf45cee1461014c575b610000565b34610000576100906004808035600019169060200190919080359060200190919080359060200190919050506101ad565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576100df610259565b60405180826000191660001916815260200191505060405180910390f35b346100005761010a610264565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761016b6004808035600019169060200190919050506102aa565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006000848484604051610227806102f18339018084600019166000191681526020018381526020018281526020019350505050604051809103906000f080156100005790508060016000876000191660001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508091505b509392505050565b600060005490505b90565b6000600160006000546000191660001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b600060016000836000191660001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050560060606040523461000057604051606080610227833981016040528080519060200190919080519060200190919080519060200190919050505b826000816000191690555081600181905550806002819055505b5050505b6101c2806100656000396000f30060606040523615610076576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806317d7de7c1461007b5780635ac801fe146100a6578063679aefce146100c7578063deae0f77146100ea578063eb5bd8ba14610107578063f4b7095b14610124575b610000565b3461000057610088610147565b60405180826000191660001916815260200191505060405180910390f35b34610000576100c5600480803560001916906020019091905050610152565b005b34610000576100d4610161565b6040518082815260200191505060405180910390f35b3461000057610105600480803590602001909190505061016c565b005b34610000576101226004808035906020019091905050610180565b005b346100005761013161018b565b6040518082815260200191505060405180910390f35b600060005490505b90565b80600081600019169055505b50565b600060025490505b90565b806001600082825401925050819055505b50565b806001819055505b50565b600060015490505b905600a165627a7a723058204b617b3f7508a365c7f84211f2b3cab977d9aa3686894af22785ce083781e21d0029a165627a7a723058209c8a3c0efdfb86fd798e76032f02fe21436046f9d4b8ea67b49d08e812506ff9002960606040523461000057604051606080610227833981016040528080519060200190919080519060200190919080519060200190919050505b826000816000191690555081600181905550806002819055505b5050505b6101c2806100656000396000f30060606040523615610076576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806317d7de7c1461007b5780635ac801fe146100a6578063679aefce146100c7578063deae0f77146100ea578063eb5bd8ba14610107578063f4b7095b14610124575b610000565b3461000057610088610147565b60405180826000191660001916815260200191505060405180910390f35b34610000576100c5600480803560001916906020019091905050610152565b005b34610000576100d4610161565b6040518082815260200191505060405180910390f35b3461000057610105600480803590602001909190505061016c565b005b34610000576101226004808035906020019091905050610180565b005b346100005761013161018b565b6040518082815260200191505060405180910390f35b600060005490505b90565b80600081600019169055505b50565b600060025490505b90565b806001600082825401925050819055505b50565b806001819055505b50565b600060015490505b905600a165627a7a723058204b617b3f7508a365c7f84211f2b3cab977d9aa3686894af22785ce083781e21d0029'
    let abi = [{ "constant": false, "inputs": [{ "name": "_companyName", "type": "bytes32" }, { "name": "points", "type": "int256" }, { "name": "rate", "type": "uint256" }], "name": "addLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getCompanyName", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "getLocalLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "getLoyaltyPoint", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "_companyName", "type": "bytes32" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }]
    let account = new web3.eth.Contract(abi)
    await account.deploy({
        data: bytecode,
        arguments: [companyNum]
    }).send({
        from: web3.eth.defaultAccount,
        gas: '8888888'
    }).then(function (newContractInstance) {
        address = newContractInstance.options.address
        account.options.address = address
        tar = ((company == 'companyA')?'002':'001')
        rate = ((company == 'companyA')?'50':'200')
        account.methods.addLoyaltyPoint(tar, 0, rate).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        })
    })
    return address
}
//部屬Exchange
async function deployExchange(a1, a2) {
    web3.eth.defaultAccount = await web3.eth.getCoinbase()
    let address
    let bytecode = '0x60606040523461000057604051604080610935833981016040528080519060200190919080519060200190919050505b81600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50505b610871806100c46000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806352bd129c14610054578063a2cc30fe146100a3578063db613e81146100f2575b610000565b3461000057610061610141565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576100d86004808035600019169060200190919080356000191690602001909190803590602001909190505061016c565b604051808215151515815260200191505060405180910390f35b34610000576100ff61081a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b60006000600060006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbf45cee886000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808260001916600019168152602001915050602060405180830381600087803b156100005760325a03f11561000057505050604051805190509350600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a8753d586000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f11561000057505050604051805190509250600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbf45cee896000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808260001916600019168152602001915050602060405180830381600087803b156100005760325a03f11561000057505050604051805190509150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a8753d586000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f115610000575050506040518051905090506000868473ffffffffffffffffffffffffffffffffffffffff1663f4b7095b6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f11561000057505050604051805190500312156104e6577fa8b5c7566a171f8a28662bb782cf261affa362b9a1dc23bf8da6dc0612a90be66000604051808215151515815260200191505060405180910390a16000945061080f565b8273ffffffffffffffffffffffffffffffffffffffff1663deae0f77876000036040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100005760325a03f115610000575050508173ffffffffffffffffffffffffffffffffffffffff1663deae0f77876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100005760325a03f115610000575050508373ffffffffffffffffffffffffffffffffffffffff1663deae0f7760648673ffffffffffffffffffffffffffffffffffffffff1663679aefce6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f11561000057505050604051805190508902811561000057056040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100005760325a03f115610000575050508073ffffffffffffffffffffffffffffffffffffffff1663deae0f7760648673ffffffffffffffffffffffffffffffffffffffff1663679aefce6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f11561000057505050604051805190508902811561000057056000036040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100005760325a03f115610000575050507fa8b5c7566a171f8a28662bb782cf261affa362b9a1dc23bf8da6dc0612a90be66001604051808215151515815260200191505060405180910390a1600194505b505050509392505050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b905600a165627a7a72305820653b9ee235e65d5863047f7cf974429356a61ae25e2b70a12f60b1003b07ecf80029'
    let abi = [{ "constant": true, "inputs": [], "name": "getPartnerAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": false, "inputs": [{ "name": "sourceName", "type": "bytes32" }, { "name": "targetName", "type": "bytes32" }, { "name": "amount", "type": "int256" }], "name": "to", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "getAccount", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "inputs": [{ "name": "me", "type": "address" }, { "name": "partner", "type": "address" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "test", "type": "bool" }], "name": "testFunctionRun", "type": "event" }]
    let exchange = new web3.eth.Contract(abi)
    await exchange.deploy({
        data: bytecode,
        arguments: [a1, a2]
    }).send({
        from: web3.eth.defaultAccount,
        gas: '8888888'
    }).then(function (newContractInstance) {
        address = newContractInstance.options.address
    })
    return address
}

module.exports = router;