const express = require('express')
const session = require('express-session')
const router = express.Router()

const path = require('path')
const fs = require('fs')

const run = require('../lib/run.js')
const sql = require('../lib/SQL.js')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8546'))

//管理員權限
let administrator// = 'nidhogg5'

if (!fs.existsSync('temp')) {
	fs.mkdirSync('temp')
}

// 資料庫連線發生錯誤處理
sql.connection.connect(function (err) {
	if (err) {
		console.log('error when connecting to db:', err);
		// 2秒後重新連線
		//setTimeout(handleDisconnect, 2000);
	}
})

//判斷是否登入
let isSign = async function (req, res, next) {
	if (req.session.ID) { next() }
	else { res.redirect('/') }
}

//GET首頁和專案管理頁面
router.get('/', async function (req, res, next) {

	//自動登入
	if (administrator) {
		req.session.ID = administrator
	}

	if (req.session.ID) {
		res.render('project', {
			ID: req.session.ID,
			email: req.session.email,
			api_key: await sql.getApiKeyByID(req.session.ID),
		})
	} else {
		res.render('index')
	}
})

//GET編輯頁面
router.get('/editor/:name', isSign, async function (req, res, next) {
	let project = await sql.get_project(req.session.ID, req.params.name)
	res.render('editor', {
		ID: req.session.ID,
		project: project.project,
		contract: project.contract,
		feature: project.feature,
		stepDefinitions: project.stepDefinitions,
		mocha: project.mocha,
		solidity: project.solidity,
		step: project.step,
	})
})

//產生新的API KEY
router.get('/reGenerateApiKey', isSign, async function (req, res, next) {
	let ApiKey = await sql.reGenerateApiKey(req.session.ID)
	console.log(ApiKey)
	res.send(ApiKey)
})

//GET 專案列表
router.get('/projectList', isSign, async function (req, res, next) {
	let project_list = await sql.get_project_list(req.session.ID)
	res.json(project_list)
})

router.route('/project/:name', isSign)
	//GET專案
	.get(async function (req, res, next) {
		let project = await sql.get_project(req.session.ID, req.params.name)
		res.json(project)
	})
	//POST專案
	.post(async function (req, res, next) {
		let result = await sql.new_project(req.session.ID, req.params.name, req.body.contract)
		res.json(result)
	})
	//DELETE專案
	.delete(async function (req, res, next) {
		await sql.delete_project(req.session.ID, req.params.name)
		res.send('成功')
	})
	//PUT專案
	.put(async function (req, res, next) {
		await sql.update_project(req.session.ID, req.params.name, req.body.feature, req.body.stepDefinitions, req.body.solidity, req.body.mocha, req.body.step)
		res.send('成功')
	})

router.post('/cucumber', async function (req, res, next) {
	//檢查資料夾是否存在
	if (!fs.existsSync(`temp/${req.session.ID}`)) {
		await fs.mkdirSync(`temp/${req.session.ID}`)
		await fs.mkdirSync(`temp/${req.session.ID}/s`)
		await fs.mkdirSync(`temp/${req.session.ID}/m`)
		await fs.mkdirSync(`temp/${req.session.ID}/s/step_definitions`)
		await fs.mkdirSync(`temp/${req.session.ID}/m/test`)
	}
	//執行
	try {
		let result = await run.cucumber(req.session.ID, req.body.featureSource, req.body.stepDefinitions)
		res.send(result)
	} catch (error) {
		res.send(error)
	}
})

router.post('/mocha', async function (req, res, next) {
	//檢查資料夾是否存在
	if (!fs.existsSync(`temp/${req.session.ID}`)) {
		await fs.mkdirSync(`temp/${req.session.ID}`)
		await fs.mkdirSync(`temp/${req.session.ID}/s`)
		await fs.mkdirSync(`temp/${req.session.ID}/m`)
		await fs.mkdirSync(`temp/${req.session.ID}/s/step_definitions`)
		await fs.mkdirSync(`temp/${req.session.ID}/m/test`)
	}
	try {
		let result = await run.mocha(req.session.ID, req.body.mocha, req.body.code)
		res.send(result)
	} catch (error) {
		res.send(error)
	}
})

router.post('/compile', async function (req, res, next) {
	try {
		let result = await run.compile(req.body.solidity)
		res.send(result)
	} catch (error) {
		res.send(error)
	}
})

module.exports = router;