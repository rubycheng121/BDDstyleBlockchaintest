const express = require('express')
const router = express.Router()

const sql = require('../lib/SQL.js')
const run = require('../lib/run.js')

var checkApiKey = async function (req, res, next) {
    console.log('check api key')

    let user = await sql.getUserByApiKey(req.query.apikey)

    if (user) next()
    else res.status(400).send({ error: 'ApiKeyInvalidError' })
}

//登入
router.get('/sign_in', async function (req, res, next) {
    console.log('api sign_in')
    console.log(req.query)
    let result = await sql.sing_in(req.query.userID, req.query.password)
    if (result.type == 1) {
        let api_key = await sql.getApiKeyByID(req.query.userID)
        res.json({ inf: '登入成功', apikey: api_key })
    }
    else if (result.type == 0){
        res.status(400).send({ error: 'UserIDError' })
    }
    else if(result.type == 2) {
        res.status(400).send({ error: 'PasswordError' })
    }
})

//註冊
router.post('/sign_up', async function (req, res, next) {
    console.log('api sign_up')
    console.log(req.body)
    let result = await sql.sing_up(req.body.userID, req.body.password, req.body.email)
    res.json(result)
})

//查看現有projects
router.get('/projects', checkApiKey, async function (req, res, next) {
    console.log('api get project list')

    let user = await sql.getUserByApiKey(req.query.apikey)
    let projects = await sql.get_project_list(user.ID, req.query.password)
    res.json(projects)
})

router.route('/project/:name')
    //取得project內容
    .get(checkApiKey, async function (req, res, next) {
        console.log('api get project')

        let user = await sql.getUserByApiKey(req.query.apikey)
        let project = await sql.get_project(user.ID, req.params.name)

        if (project) {
            delete project['ID']
            delete project['contract']
            delete project['status']
            res.json(project)
        }
        else {
            res.status(400).send({ error: 'ProjectNameError' })
        }
    })
    //新增專案
    .post(checkApiKey, async function (req, res, next) {
        console.log('api new projects')

        let user = await sql.getUserByApiKey(req.query.apikey)
        let project = await sql.get_project(user.ID, req.params.name)
        if (!project) {
            await sql.new_project(user.ID, req.params.name, req.body.contract)
            res.json({ inf: '成功' })
        }
        else {
            res.status(400).send({ error: 'ProjectNameExistError' })
        }
    })
    //更新專案
    .put(checkApiKey, async function (req, res, next) {
        console.log('api update project')

        let user = await sql.getUserByApiKey(req.query.apikey)
        let project = await sql.get_project(user.ID, req.params.name)

        console.log(req.body)

        if (project) {
            console.log(user.ID, req.params.name, req.body.feature, req.body.stepDefinitions, req.body.solidity, req.body.mocha)
            console.log(await sql.update_project(user.ID, req.params.name, req.body.feature, req.body.stepDefinitions, req.body.solidity, req.body.mocha))
            res.send({ inf: '成功' })
        }
        else {
            res.status(400).send({ error: 'ProjectNameError' })
        }
    })
    //刪除專案
    .delete(checkApiKey, async function (req, res, next) {
        console.log('api delete project')

        let user = await sql.getUserByApiKey(req.query.apikey)
        let project = await sql.get_project(user.ID, req.params.name)

        if (project) {
            sql.delete_project(user.ID, req.params.name)
            res.send({ inf: '成功' })
        }
        else {
            res.status(400).send({ error: 'ProjectNameError' })
        }
    })

//執行cucumber
router.get('/run/cucumber/:name', checkApiKey, async function (req, res, next) {
    console.log('api run cucumber')

    let user = await sql.getUserByApiKey(req.query.apikey)
    let project = await sql.get_project(user.ID, req.params.name)

    if (project) {
        let result = await run.cucumber(project.feature, project.stepDefinitions)
        res.send(result)
    }
    else {
        res.status(400).send({ error: 'ProjectNameError' })
    }
})

//執行mocha
router.get('/run/mocha/:name', checkApiKey, async function (req, res, next) {
    console.log('api run mocha')

    let user = await sql.getUserByApiKey(req.query.apikey)
    let project = await sql.get_project(user.ID, req.params.name)

    if (project) {
        let result = await run.mocha(project.mocha)
        res.send(result)
    }
    else {
        res.status(400).send({ error: 'ProjectNameError' })
    }
})

//solidity compile
router.get('/run/compile/:name', checkApiKey, async function (req, res, next) {
    console.log('api run compile')

    let user = await sql.getUserByApiKey(req.query.apikey)
    let project = await sql.get_project(user.ID, req.params.name)

    if (project) {
        let result = await run.compile(project.solidity)
        res.send(result.info)
    }
    else {
        res.status(400).send({ error: 'ProjectNameError' })
    }
})

module.exports = router
