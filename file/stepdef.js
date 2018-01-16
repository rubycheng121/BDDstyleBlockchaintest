//You can use 'assert' and 'web3'.
//If you want to use other modules, you should use 'require' or 'import' in this text.

let Account_abi = []
let Exchange_abi = []
let LoyaltyPoint_abi = []
let Account_bytecode
let Exchange_bytecode
let LoyaltyPoint_bytecode

let AccountA_contract = new web3.eth.Contract(Account_abi)
let AccountA_address
let AccountB_contract = new web3.eth.Contract(Account_abi)
let AccountB_address

let Exchange_contract = new web3.eth.Contract(Exchange_abi)
let Exchange_address

let LoyaltyPointAA_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointAA_address
let LoyaltyPointAB_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointAB_address
let LoyaltyPointBA_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointBA_address
let LoyaltyPointBB_contract = new web3.eth.Contract(LoyaltyPoint_abi)
let LoyaltyPointBB_address

defineSupportCode(function ({ Given, When, Then, And, Before, After }) {
    
    Given('the exchange rate is {int}alp={float}blp', function (int, float, callback) {
        
        rateA = int
        rateB = float
        //部署第一家公司
        AccountA_contract.deploy({
            data: Account_bytecode,
            arguments: ['001']
        }).send({
            from: web3.eth.defaultAccount,
            gas: '8888888'
        }).then(function(newContractInstance){
            AccountA_address = newContractInstance.options.address
            AccountA_contract.options.address = AccountA_address
            //部署第二家公司
            AccountB_contract.deploy({
                data: Account_bytecode,
                arguments: ['002']
            }).send({
                from: web3.eth.defaultAccount,
                gas: '8888888'
            }).then(function(newContractInstance){
                AccountB_address = newContractInstance.options.address
                AccountB_contract.options.address = AccountB_address
                callback(assert(newContractInstance !== null,'ERROR'));
            });
        });
    });


    Given('original alp account of A is {int}', function (int, callback) {
        AccountA_contract.methods.getLocalLoyaltyPoint().call().then((address)=>{
            LoyaltyPointAA_address = address
            LoyaltyPointAA_contract.options.address = LoyaltyPointAA_address
            ///@method {"contract":"LoyaltyPointAA","name":"addPoints","argument":1,"isConstant":false}
            //增加第一家公司的點數
            LoyaltyPointAA_contract.methods.addPoints(int).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }, function(error, transactionHash){
                callback(assert.equal(error,null,error))
            });
        })
    });


    Given('original blp account of A is {int}', function (int, callback) {

        ///@method {"contract":"AccountA","name":"addLoyaltyPoint","argument":3,"isConstant":false}
        //增加第一家公司紀錄的第二家公司的點數
        AccountA_contract.methods.addLoyaltyPoint('002', int, (rateB / rateA) * 100).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }, function(error, transactionHash){
            callback(assert.equal(error,null,error))
        });
    });


    Given('original alp account of B is {int}', function (int, callback) {

        ///@method {"contract":"AccountB","name":"addLoyaltyPoint","argument":3,"isConstant":false}
        //增加第二家公司紀錄的第一家公司的點數
        AccountB_contract.methods.addLoyaltyPoint('001', int, (rateA / rateB) * 100).send({
            from: web3.eth.defaultAccount,
            gas: 44444444
        }, function(error, transactionHash){
            callback(assert.equal(error,null,error))
        });
    });


    Given('original blp account of B is {int}', function (int, callback) {
        AccountB_contract.methods.getLocalLoyaltyPoint().call().then((address)=>{
            LoyaltyPointBB_address = address
            LoyaltyPointBB_contract.options.address = LoyaltyPointBB_address
            ///@method {"contract":"LoyaltyPointBB","name":"addPoints","argument":1,"isConstant":false}
            //增加第二家公司的點數
            LoyaltyPointBB_contract.methods.addPoints(int).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }, function(error, transactionHash){
                callback(assert.equal(error,null,error))
            });
        })
    });


    When('A want to exchange {int} alp for blp', function (int, callback) {
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
            Exchange_contract.methods.to('001', '002', int).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }, function(error, transactionHash){
                callback(assert.equal(error,null,error))
            });
        })
    });


    Then('alp account of A should be {int}', function (int, callback) {
        ///@method {"contract":"LoyaltyPointAA","name":"getPoints","argument":0,"isConstant":true}
        //取得第一家公司的點數
        LoyaltyPointAA_contract.methods.getPoints().call().then((result)=>{
            callback(assert.equal(result,int,result))
        })
    });


    Then('blp account of A should be {int}', function (int, callback) {
        //取得第一家公司紀錄的第二家公司的點數
        AccountA_contract.methods.getLoyaltyPoint('002').call().then((address)=>{
            LoyaltyPointAB_address = address
            LoyaltyPointAB_contract.options.address = LoyaltyPointAB_address
            ///@method {"contract":"LoyaltyPointAB","name":"getPoints","argument":0,"isConstant":true}
            LoyaltyPointAB_contract.methods.getPoints().call().then((result)=>{
                callback(assert.equal(result,int,result))
            })
        })
        
    });


    Then('alp account of B should be {int}', function (int, callback) {
        //取得第二家公司紀錄的第一家公司的點數
        AccountB_contract.methods.getLoyaltyPoint('001').call().then((address)=>{
            LoyaltyPointBA_address = address
            LoyaltyPointBA_contract.options.address = LoyaltyPointBA_address
            ///@method {"contract":"LoyaltyPointBA","name":"getPoints","argument":0,"isConstant":true}
            LoyaltyPointBA_contract.methods.getPoints().call().then((result)=>{
                callback(assert.equal(result,int,result))
            })
        })
    });


    Then('blp account of B should be {int}', function (int, callback) {
        ///@method {"contract":"LoyaltyPointBB_contract","name":"getPoints","argument":0,"isConstant":true}
        //取得第二家公司的點數
        LoyaltyPointBB_contract.methods.getPoints().call().then((result)=>{
            callback(assert.equal(result,int,result))
        })
    });

});