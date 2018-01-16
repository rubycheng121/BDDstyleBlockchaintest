var express = require('express')
var router = express.Router()
var sql = require('../lib/SQL.js')

//登入
router.post('/sign_in', async function (req, res, next) {
	console.log("sign_in")
	console.log(req.body)
	let result = await sql.sing_in(req.body.ID, req.body.password)
	if (result.type == 1) {
		req.session.ID = result.user.ID
		req.session.email = result.user.email
	}
	res.json(result)
})

//註冊
router.post('/sign_up', async function (req, res, next) {
	console.log("sign_up")
	console.log(req.body)
	if (req.body.password == "" || req.body.ID == "" || req.body.password == "" || req.body.email == "") {
		res.json({ type: false, inf: '資料不可為空' })
	}
	else if (req.body.password == req.body.re_password) {
		let result = await sql.sing_up(req.body.ID, req.body.password, req.body.email)
		res.json(result)
	}
	else {
		res.json({ type: false, inf: '兩次密碼輸入不一樣' })
	}
})

//登出
router.get('/sign_out', function (req, res, next) {
	console.log("sign_out")
	req.session.destroy()
	res.redirect('/')
})

//重設密碼
router.post('/update_password', async function (req, res, next) {
	console.log("update_password")
	console.log(req.body)
	let result = await sql.sing_in(req.session.ID, req.body.old_password)
	if (result.type == 1) {
		await sql.update_password(req.session.ID, req.body.new_password)
		res.json({type: true, inf:'密碼更新成功'})
	}
	else {
		res.json({type: false, inf:'舊密碼錯誤'})
	}
})

module.exports = router
