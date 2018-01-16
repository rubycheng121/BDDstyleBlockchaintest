const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

web3.eth.defaultAccount = '0x9fc6d407a426755e0a6e7cd364689ccedf76cb32'
//You can use 'assert' and 'web3'.
//If you want to use other modules, you should use 'require' or 'import' in this text.

let Account_abi = [{"constant":false,"inputs":[{"name":"_companyName","type":"bytes32"},{"name":"points","type":"int256"},{"name":"rate","type":"uint256"}],"name":"addLoyaltyPoint","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCompanyName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getLocalLoyaltyPoint","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"bytes32"}],"name":"getLoyaltyPoint","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_companyName","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
let LoyaltyPoint_abi = [{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"int256"}],"name":"addPoints","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"setPoints","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPoints","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"bytes32"},{"name":"_points","type":"int256"},{"name":"_rate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
let Exchange_abi = [{"constant":true,"inputs":[],"name":"getPartnerAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sourceName","type":"bytes32"},{"name":"targetName","type":"bytes32"},{"name":"amount","type":"int256"}],"name":"to","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"me","type":"address"},{"name":"partner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"test","type":"bool"}],"name":"testFunctionRun","type":"event"}]
let Account_bytecode = '0x6060604052341561000f57600080fd5b60405160208061069c833981016040528080519150505b600081815581816064610037610097565b928352602083019190915260408083019190915260609091019051809103906000f080151561006557600080fd5b6000805481526001602052604090208054600160a060020a031916600160a060020a03831617905590505b50506100a7565b6040516101e7806104b583390190565b6103ff806100b66000396000f300606060405263ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166318e48622811461005e57806343cfbd6514610096578063a8753d58146100bb578063bbf45cee146100ea575b600080fd5b341561006957600080fd5b61007a60043560243560443561011c565b604051600160a060020a03909116815260200160405180910390f35b34156100a157600080fd5b6100a961019a565b60405190815260200160405180910390f35b34156100c657600080fd5b61007a6101a1565b604051600160a060020a03909116815260200160405180910390f35b34156100f557600080fd5b61007a6004356101be565b604051600160a060020a03909116815260200160405180910390f35b60008084848461012a6101dc565b928352602083019190915260408083019190915260609091019051809103906000f080151561015857600080fd5b6000868152600160205260409020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03831617905591508190505b509392505050565b6000545b90565b60008054815260016020526040902054600160a060020a03165b90565b600081815260016020526040902054600160a060020a03165b919050565b6040516101e7806101ed8339019056006060604052341561000f57600080fd5b6040516060806101e78339810160405280805191906020018051919060200180519150505b6000839055600182905560028190555b5050505b610190806100576000396000f300606060405236156100755763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166317d7de7c811461007a5780635ac801fe1461009f578063679aefce146100b7578063deae0f77146100dc578063eb5bd8ba146100f4578063f4b7095b1461010c575b600080fd5b341561008557600080fd5b61008d610131565b60405190815260200160405180910390f35b34156100aa57600080fd5b6100b5600435610138565b005b34156100c257600080fd5b61008d610141565b60405190815260200160405180910390f35b34156100e757600080fd5b6100b5600435610148565b005b34156100ff57600080fd5b6100b5600435610154565b005b341561011757600080fd5b61008d61015d565b60405190815260200160405180910390f35b6000545b90565b60008190555b50565b6002545b90565b60018054820190555b50565b60018190555b50565b6001545b905600a165627a7a723058200710c81b8d81b394696a326e144dfdeb604af83230a18accb1aafeb27c3acf420029a165627a7a72305820d29b4e5665b723ec5ee6b3568d3797b5fe698404d1803559c9479b981babacaf00296060604052341561000f57600080fd5b6040516060806101e78339810160405280805191906020018051919060200180519150505b6000839055600182905560028190555b5050505b610190806100576000396000f300606060405236156100755763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166317d7de7c811461007a5780635ac801fe1461009f578063679aefce146100b7578063deae0f77146100dc578063eb5bd8ba146100f4578063f4b7095b1461010c575b600080fd5b341561008557600080fd5b61008d610131565b60405190815260200160405180910390f35b34156100aa57600080fd5b6100b5600435610138565b005b34156100c257600080fd5b61008d610141565b60405190815260200160405180910390f35b34156100e757600080fd5b6100b5600435610148565b005b34156100ff57600080fd5b6100b5600435610154565b005b341561011757600080fd5b61008d61015d565b60405190815260200160405180910390f35b6000545b90565b60008190555b50565b6002545b90565b60018054820190555b50565b60018190555b50565b6001545b905600a165627a7a723058200710c81b8d81b394696a326e144dfdeb604af83230a18accb1aafeb27c3acf420029'
let LoyaltyPoint_bytecode = '0x6060604052341561000f57600080fd5b6040516060806101e78339810160405280805191906020018051919060200180519150505b6000839055600182905560028190555b5050505b610190806100576000396000f300606060405236156100755763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166317d7de7c811461007a5780635ac801fe1461009f578063679aefce146100b7578063deae0f77146100dc578063eb5bd8ba146100f4578063f4b7095b1461010c575b600080fd5b341561008557600080fd5b61008d610131565b60405190815260200160405180910390f35b34156100aa57600080fd5b6100b5600435610138565b005b34156100c257600080fd5b61008d610141565b60405190815260200160405180910390f35b34156100e757600080fd5b6100b5600435610148565b005b34156100ff57600080fd5b6100b5600435610154565b005b341561011757600080fd5b61008d61015d565b60405190815260200160405180910390f35b6000545b90565b60008190555b50565b6002545b90565b60018054820190555b50565b60018190555b50565b6001545b905600a165627a7a723058200710c81b8d81b394696a326e144dfdeb604af83230a18accb1aafeb27c3acf420029'
let Exchange_bytecode = '0x6060604052341561000f57600080fd5b60405160408061066883398101604052808051919060200180519150505b60008054600160a060020a03808516600160a060020a03199283161790925560018054928416929091169190911790555b50505b6105f8806100706000396000f300606060405263ffffffff60e060020a60003504166352bd129c811461003a578063a2cc30fe14610069578063db613e8114610099575b600080fd5b341561004557600080fd5b61004d6100c8565b604051600160a060020a03909116815260200160405180910390f35b341561007457600080fd5b6100856004356024356044356100d8565b604051901515815260200160405180910390f35b34156100a457600080fd5b61004d6105bc565b604051600160a060020a03909116815260200160405180910390f35b600154600160a060020a03165b90565b600080548190819081908190600160a060020a031663bbf45cee88836040516020015260405160e060020a63ffffffff84160281526004810191909152602401602060405180830381600087803b151561013157600080fd5b6102c65a03f1151561014257600080fd5b505050604051805160008054919650600160a060020a03909116915063a8753d5890604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b151561019957600080fd5b6102c65a03f115156101aa57600080fd5b5050506040518051600154909450600160a060020a0316905063bbf45cee8960006040516020015260405160e060020a63ffffffff84160281526004810191909152602401602060405180830381600087803b151561020857600080fd5b6102c65a03f1151561021957600080fd5b5050506040518051600154909350600160a060020a0316905063a8753d586000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b151561026e57600080fd5b6102c65a03f1151561027f57600080fd5b50505060405180519050905060008684600160a060020a031663f4b7095b6000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b15156102d457600080fd5b6102c65a03f115156102e557600080fd5b50505060405180519050031215610335577fa8b5c7566a171f8a28662bb782cf261affa362b9a1dc23bf8da6dc0612a90be66000604051901515815260200160405180910390a1600094506105b1565b82600160a060020a031663deae0f778760000360405160e060020a63ffffffff84160281526004810191909152602401600060405180830381600087803b151561037e57600080fd5b6102c65a03f1151561038f57600080fd5b50505081600160a060020a031663deae0f778760405160e060020a63ffffffff84160281526004810191909152602401600060405180830381600087803b15156103d857600080fd5b6102c65a03f115156103e957600080fd5b505050600160a060020a03841663deae0f7760648263679aefce6000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b151561043a57600080fd5b6102c65a03f1151561044b57600080fd5b50505060405180519050890281151561046057fe5b0560405160e060020a63ffffffff84160281526004810191909152602401600060405180830381600087803b151561049757600080fd5b6102c65a03f115156104a857600080fd5b50505080600160a060020a031663deae0f77606486600160a060020a031663679aefce6000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b151561050257600080fd5b6102c65a03f1151561051357600080fd5b50505060405180519050890281151561052857fe5b0560000360405160e060020a63ffffffff84160281526004810191909152602401600060405180830381600087803b151561056257600080fd5b6102c65a03f1151561057357600080fd5b5050507fa8b5c7566a171f8a28662bb782cf261affa362b9a1dc23bf8da6dc0612a90be66001604051901515815260200160405180910390a1600194505b505050509392505050565b600054600160a060020a03165b905600a165627a7a723058202f3180f5989846a1f192244945b09f26ac47cae1d5165eabc7df5b6b555686290029'

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
                done(assert(newContractInstance !== null,'ERROR'));
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
                }, function(error, transactionHash){
                    done(assert.equal(error,null,error))
                });
            })
        })
    })

    describe('Successfully Use addLoyaltyPoint(arg1,arg2,arg3)', function () {
        it('should work', function (done) {
            ///@method {"contract":"AccountA","name":"addLoyaltyPoint","argument":3,"isConstant":false}
            //增加第一家公司紀錄的第二家公司的點數
            AccountA_contract.methods.addLoyaltyPoint('002', 100, 50).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }, function(error, transactionHash){
                done(assert.equal(error,null,error))
            });
        })
    })

    describe('Successfully Use addLoyaltyPoint(arg1,arg2,arg3)', function () {
        it('should work', function (done) {
            ///@method {"contract":"AccountB","name":"addLoyaltyPoint","argument":3,"isConstant":false}
            //增加第二家公司紀錄的第一家公司的點數
            AccountB_contract.methods.addLoyaltyPoint('001', 50, 200).send({
                from: web3.eth.defaultAccount,
                gas: 44444444
            }, function(error, transactionHash){
                done(assert.equal(error,null,error))
            });
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
                }, function(error, transactionHash){
                    done(assert.equal(error,null,error))
                });
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
                Exchange_contract.methods.to('001', '002', 10).send({
                    from: web3.eth.defaultAccount,
                    gas: 44444444
                }, function(error, transactionHash){
                    done(assert.equal(error,null,error))
                });
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            ///@method {"contract":"LoyaltyPointAA","name":"getPoints","argument":0,"isConstant":true}
            //取得第一家公司的點數
            LoyaltyPointAA_contract.methods.getPoints().call().then((result)=>{
                done(assert.equal(result,40,result))
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            AccountA_contract.methods.getLoyaltyPoint('002').call().then((address)=>{
                LoyaltyPointAB_address = address
                LoyaltyPointAB_contract.options.address = LoyaltyPointAB_address
                ///@method {"contract":"LoyaltyPointAB","name":"getPoints","argument":0,"isConstant":true}
                //取得第一家公司紀錄的第二家公司的點數
                LoyaltyPointAB_contract.methods.getPoints().call().then((result)=>{
                    done(assert.equal(result,105,result))
                })
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            AccountB_contract.methods.getLoyaltyPoint('001').call().then((address)=>{
                LoyaltyPointBA_address = address
                LoyaltyPointBA_contract.options.address = LoyaltyPointBA_address
                ///@method {"contract":"LoyaltyPointBA","name":"getPoints","argument":0,"isConstant":true}
                //取得第二家公司紀錄的第一家公司的點數
                LoyaltyPointBA_contract.methods.getPoints().call().then((result)=>{
                    done(assert.equal(result,60,result))
                })
            })
        })
    })

    describe('Successfully Use getPoints()', function () {
        it('should work', function (done) {
            ///@method {"contract":"LoyaltyPointBB","name":"getPoints","argument":0,"isConstant":true}
            //取得第二家公司的點數
            LoyaltyPointBB_contract.methods.getPoints().call().then((result)=>{
                done(assert.equal(result,95,result))
            })
        })
    })


})