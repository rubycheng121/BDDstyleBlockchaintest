//You can use 'assert' and 'web3'.
//If you want to use other modules, you should use 'require' or 'import' in this text.

let Account_abi = []
let LoyaltyPoint_abi = []
let Exchange_abi = []
let Account_bytecode
let LoyaltyPoint_bytecode
let Exchange_bytecode

let AccountA_contract = new web3.eth.Contract(Account_abi)
let AccountA_address
let AccountB_contract = new web3.eth.Contract(Account_abi)
let AccountB_address

let LoyaltyPointAA_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointAA_address
let LoyaltyPointAB_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointAB_address
let LoyaltyPointBA_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointBA_address
let LoyaltyPointBB_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointBB_address

let Exchange_contract = new web3.eth.Contract(Exchange_abi)
let Exchange_address

describe('Scenario : Successfully Use Functions', function () {
    this.timeout(0)

    //deploy your contract
    before(function (done) {
        //部署第一家公司
        AccountA_contract.deploy({
            data: Account_bytecode,
            arguments: ['0x00']
        }).send({
            from: web3.eth.defaultAccount,
            gas: '8888888'
        }).then(function(newContractInstance){
            AccountA_address = newContractInstance.options.address
            AccountA_contract.options.address = AccountA_address
            //部署第二家公司
            AccountB_contract.deploy({
                data: Account_bytecode,
                arguments: ['0x01']
            }).send({
                from: web3.eth.defaultAccount,
                gas: '8888888'
            }).then(function(newContractInstance){
                AccountB_address = newContractInstance.options.address
                AccountB_contract.options.address = AccountB_address
                done();
            });
        });
    })

    describe('Successfully Use addPoints(arg1)', function () {
        it('should work', function (done) {
            AccountA_contract.methods.getLocalLoyaltyPoint().call().then((address)=>{
                LoyaltyPointAA_address = address
                LoyaltyPointAA_contract.options.address = LoyaltyPointAA_address
                ///@method {"contract":"LoyaltyPointAA","name":"addPoints","argument":1,"isConstant":false}
                //增加第一家公司的點數
                LoyaltyPointAA_contract.methods.addPoints(50).send({
                    from: web3.eth.defaultAccount,
                    gas: 44444444
                }).then(function(){done()})
            })
        })
    })

    describe('Successfully Use addLoyaltyPoint(arg1,arg2,arg3)', function () {
        it('should work', function (done) {
            ///@method {"contract":"AccountA","name":"addLoyaltyPoint","argument":3,"isConstant":false}
            //增加第一家公司紀錄的第二家公司的點數
            AccountA_contract.methods.addLoyaltyPoint('0x01', 100, 50).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }).then(function(){done()})
        })
    })

    describe('Successfully Use addLoyaltyPoint(arg1,arg2,arg3)', function () {
        it('should work', function (done) {
            ///@method {"contract":"AccountB","name":"addLoyaltyPoint","argument":3,"isConstant":false}
            //增加第二家公司紀錄的第一家公司的點數
            AccountB_contract.methods.addLoyaltyPoint('0x00', 50, 200).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }).then(function(){done()})
        })
    })

    describe('Successfully Use addPoints(arg1)', function () {
        it('should work', function (done) {
            AccountB_contract.methods.getLocalLoyaltyPoint().call().then((address)=>{
                LoyaltyPointBB_address = address
                LoyaltyPointBB_contract.options.address = LoyaltyPointBB_address
                ///@method {"contract":"LoyaltyPointBB","name":"addPoints","argument":1,"isConstant":false}
                //增加第二家公司的點數
                LoyaltyPointBB_contract.methods.addPoints(100).send({
                    from: web3.eth.defaultAccount,
                    gas: 44444444
                }).then(function(){done()})
            })
        })
    })

    describe('Successfully Use to(arg1,arg2,arg3)', function () {
        it('should work', function (done) {
            //部署交換點數合約
            Exchange_contract.deploy({
                data: Exchange_bytecode,
                arguments: [AccountA_address, AccountB_address]
            }).send({
                from: web3.eth.defaultAccount,
                gas: '8888888'
            }).then(function(newContractInstance){
                Exchange_address = newContractInstance.options.address
                Exchange_contract.options.address = Exchange_address
                ///@method {"contract":"Exchange","name":"to","argument":3,"isConstant":false}
                //兩家公司交換點數
                Exchange_contract.methods.to('0x00', '0x01', 10).send({
                    from: web3.eth.defaultAccount,
                    gas: 44444444
                }).then(function(){done()})
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            ///@method {"contract":"LoyaltyPointAA","name":"getPoints","argument":0,"isConstant":true}
            //取得第一家公司的點數
            LoyaltyPointAA_contract.methods.getPoints().call().then((result)=>{done()})
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            AccountA_contract.methods.getLoyaltyPoint('0x01').call().then((address)=>{
                LoyaltyPointAB_address = address
                LoyaltyPointAB_contract.options.address = LoyaltyPointAB_address
                ///@method {"contract":"LoyaltyPointAB","name":"getPoints","argument":0,"isConstant":true}
                //取得第一家公司紀錄的第二家公司的點數
                LoyaltyPointAB_contract.methods.getPoints().call().then((result)=>{done()})
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            AccountB_contract.methods.getLoyaltyPoint('0x00').call().then((address)=>{
                LoyaltyPointBA_address = address
                LoyaltyPointBA_contract.options.address = LoyaltyPointBA_address
                ///@method {"contract":"LoyaltyPointBA","name":"getPoints","argument":0,"isConstant":true}
                //取得第二家公司紀錄的第一家公司的點數
                LoyaltyPointBA_contract.methods.getPoints().call().then((result)=>{done()})
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            ///@method {"contract":"LoyaltyPointBB","name":"getPoints","argument":0,"isConstant":true}
            //取得第二家公司的點數
            LoyaltyPointBB_contract.methods.getPoints().call().then((result)=>{done()})
        })
    })


})