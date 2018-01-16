$(window).load(function () {
	let functionName
	//初始化流程控制
	let process = Process()
	let step = { value: 0, done: false }
	while (step.value < $("#step").val()) {
		step = process.next()
	}
	window.onerror = displayError

	//run feature
	$('#run-feature').click(function () {
		$('a[href="#step-definitions-tab"]').tab('show')
		$.post('/cucumber', {
			featureSource: featureEditor.getValue(),
			stepDefinitions: stepDefinitionsEditor.getValue(),
		}, (result) => {
			$output.empty()
			appendToOutput(ansiHTML(result.output))
			if (result.success) {
				if (step.value == 0) { step = process.next() }
				else if (step.value == 1) { step = process.next() }
				else if (step.value == 5 && result.status) { step = process.next() }
				//如果stepDefinitions為空，新增骨架
				if (stepDefinitionsEditor.getValue().trim().length == 0) {
					
					let head = "//You can use 'assert' and 'web3'.\n//If you want to use other modules, you should use 'require' or 'import' in this text.\n\n";
					let contract_arr = JSON.parse($('#contract_name').text())
					let contract = ""
					$.each(contract_arr, function (i, item) {
						contract += format('let {}_abi = []\n', i)
					})
					contract += ''
					$.each(contract_arr, function (i, item) {
						contract += format('let {}_bytecode\n', i)
					})
					contract += '\n'
					$.each(contract_arr, function (i, item) {
						item.forEach((element, index, array) => {
							contract += format('let {}_contract = new web3.eth.Contract({}_abi)\n', element, i)
							contract += format('let {}_address\n', element)
						})
						contract += '\n'
					})
					console.log(contract_arr)
					appendToStepDefinitionsEditor(head + contract + "defineSupportCode(function ({ Given, When, Then, And }) {\n" + result.setinput.replace(//g, "") + "});")
				}
				//如果mocha為空，新增骨架
				else if (mochaEditor.getValue().trim().length == 0) {
					let head = "//You can use 'assert' and 'web3'.\n//If you want to use other modules, you should use 'require' or 'import' in this text.\n\n";
					let contract_arr = JSON.parse($('#contract_name').text())
					let contract = ""
					$.each(contract_arr, function (i, item) {
						contract += format('let {}_abi = []\n', i)
					});
					contract += ''
					$.each(contract_arr, function (i, item) {
						contract += format('let {}_bytecode\n', i)
					});
					contract += '\n'
					$.each(contract_arr, function (i, item) {
						item.forEach((element, index, array) => {
							contract += format('let {}_contract = new web3.eth.Contract({}_abi)\n', element, i)
							contract += format('let {}_address\n', element)
						});
						contract += '\n'
					});

					var func = "";
					console.log(result.next);
					if (result.next != null) {
						result.next.forEach(function (element) {
							func += "describe('Successfully Use " + element[1].replace(/(.*)\./, "") + "', function(){\n\t\tit('should work', function(done){\n\t\t\t" + element[0] + "\n\t\t\t" + element[1] + "\n\t\t\tdone()\n\t\t})\n\t})\n\n\t";
						}, this)
					}
					let body = "describe('Scenario : Successfully Use Functions', function () {\n\tthis.timeout(0)\n\n\t//deploy your contract\n\tbefore(function (done) {\n\t\tdone()\n\t})\n\n\t" + func + "\n})";
					appendToMochaEditor(head + contract + body)
				}
			}
		})
	})

	//run mocha
	$('#run-mocha').click(function () {
		$('a[href="#mocha-tab"]').tab('show')
		$.post("/mocha", {
			mocha: mochaEditor.getValue(),
			code: auxiliaryCodeEditor.getValue()
		}, (result) => {
			$mochaOutput.empty()
			appendToMochaOutput(ansiHTML(result.output))
			console.log(result)
			if (result.success) {
				if (step.value == 2) { step = process.next() }
				else if (step.value == 4 && result.status) { step = process.next() }
				//如果solidity為空，新增骨架
				if (solidityEditor.getValue().trim().length == 0) {
					var obj = JSON.parse($('#contract_name').text())
					let head = "pragma solidity ^0.4.8;\n\n"
					let contract = ""
					console.log(obj)
					console.log(result.next)
					$.each(obj, function (index, value) {
						let f = "";
						let exist_func = []
						result.next.forEach(function (element) {
							for (var v in value) {
								if (exist_func.indexOf(element[1].replace(/(.*)\./, "")) >= 0) {
									continue;
								}
								else if (value[v] == element[1].replace(/\_contract(.*)/, "").replace(/\((.*)\)/, "")) {
									exist_func.push(element[1].replace(/(.*)\./, ""))
									let json_string = element[0].replace(/\/\/\/\@method( *)/, '')
									let json = JSON.parse(json_string)
									if (json.isConstant)
										f += "\n\tfunction " + element[1].replace(/(.*)\./, "") + " constant {\n\n\t} \n"
									else
										f += "\n\tfunction " + element[1].replace(/(.*)\./, "") + "{\n\n\t} \n"
								}
							}
						})
						contract += 'contract ' + index + ' {\n\tfunction ' + index + '(){}\n' + f + '}\n\n'
					})
					appendToSolidityEditor(head + contract)
				}
			}
		})
	})

	//compile
	$('#compile').click(function () {
		$('a[href="#solidity-tab"]').tab('show')
		$solidityOutput.empty()
		$.post("/compile", {
			solidity: solidityEditor.getValue()
		}, (result) => {
			if (result.success) {
				if (step.value == 3) { step = process.next() }
				let abi = ''
				let bytecode = ''
				let deployGas = ''
				let defaultAccount = "web3.eth.defaultAccount = '" + result.account + "'\n"
				appendToStepDefinitionsEditor(defaultAccount + stepDefinitionsEditor.getValue())
				appendToMochaEditor(defaultAccount + mochaEditor.getValue())
				for (var index in result.info) {
					abi = 'let ' + result.info[index].name.slice(1) + '_abi = ' + result.info[index].abi
					bytecode = 'let ' + result.info[index].name.slice(1) + "_bytecode = '0x" + result.info[index].bytecode + "'"
					deployGas = 'gas usage:<br>deploy gas = ' + result.info[index].deploy_gas + '<br>'
					console.log(result.info[index].gas.external)
					for(let gas in result.info[index].gas.external) {
						deployGas += `${gas} = ${result.info[index].gas.external[gas]}<br>`
					}
					let str_abi = new RegExp('let ' + result.info[index].name.slice(1) + '_abi(.*)')
					let str_bytecode = new RegExp('let ' + result.info[index].name.slice(1) + '_bytecode(.*)')
					appendToStepDefinitionsEditor(stepDefinitionsEditor.getValue().replace(str_abi, abi))
					appendToStepDefinitionsEditor(stepDefinitionsEditor.getValue().replace(str_bytecode, bytecode))
					appendToMochaEditor(mochaEditor.getValue().replace(str_abi, abi))
					appendToMochaEditor(mochaEditor.getValue().replace(str_bytecode, bytecode))

					appendToSolidityOutput('<h3>' + result.info[index].name.slice(1) + '\n')
					appendToSolidityOutput(abi + '\n')
					appendToSolidityOutput(bytecode + '\n')
					appendToSolidityOutput(deployGas + '\n')
				}
			}
			else {
				appendToSolidityOutput('<h3>error</h3>')
				appendToSolidityOutput(result.errors)
			}
		})
	})

	//雲端儲存
	$('#upload').click(function () {
		$.ajax({
			url: location.pathname.replace('editor', 'project'),
			type: 'PUT',
			data: {
				feature: featureEditor.getValue(),
				stepDefinitions: stepDefinitionsEditor.getValue(),
				solidity: solidityEditor.getValue(),
				mocha: mochaEditor.getValue(),
				step: step.value,
			},
			success: function (result) {
				alert(result)
			}
		})
	})

	//全螢幕
	$('#full').click(function () {
		$('#full span').toggleClass("glyphicon-resize-full glyphicon-resize-small")
		if ($('#full span').hasClass('glyphicon-resize-small')) {
			$('header').hide()
			$('.small').removeClass('small').addClass('big')

		} else {
			$('header').show()
			$('.big').removeClass('big').addClass('small')
		}
	})

})


function* Process() {
	//feature第一次執行 產生骨架
	$('#feature-span').attr('class', 'glyphicon glyphicon-ok')
	yield 1

	$('#step_definitions-span').attr('class', 'glyphicon glyphicon-warning-sign')
	$('#run-feature span').attr('class', 'glyphicon')
	$('#run-mocha span').attr('class', 'glyphicon glyphicon-screenshot')
	yield 2

	$('#unit_test-span').attr('class', 'glyphicon glyphicon-warning-sign')
	$('#run-mocha span').attr('class', 'glyphicon')
	$('#compile span').attr('class', 'glyphicon glyphicon-screenshot')
	yield 3

	$('#contract-span').attr('class', 'glyphicon glyphicon glyphicon-ok')
	$('#compile span').attr('class', 'glyphicon')
	$('#run-mocha span').attr('class', 'glyphicon glyphicon-screenshot')
	yield 4

	$('#unit_test-span').attr('class', 'glyphicon glyphicon-ok')
	$('#run-mocha span').attr('class', 'glyphicon')
	$('#run-feature span').attr('class', 'glyphicon glyphicon-screenshot')
	yield 5

	$('#step_definitions-span').attr('class', 'glyphicon glyphicon-ok')
	$('#run-feature span').attr('class', 'glyphicon')
	return 6
}

//拖入讀檔
function dragoverHandler(evt) {
	evt.preventDefault()
}

function dropHandler(evt, target) {
	evt.preventDefault()
	var file = evt.dataTransfer.files[0]
	var reader = new FileReader()
	var editor

	switch (target) {
		case 'feature':
			editor = appendToFeatureEditor
			break
		case 'step-definitions':
			editor = appendToStepDefinitionsEditor
			break
		case 'mocha':
			editor = appendToMochaEditor
			break;
		case 'solidity':
			editor = appendToSolidityEditor
			break
	}
	reader.readAsText(file)
	reader.onload = function (event) {
		editor(event.target.result)
	}
}

function dragEnter(evt, target) {
	evt.preventDefault()
	switch (target) {
		case 'feature':
			console.log($(evt))
			$('#go-feature-tab').click()
			break
		case 'step-definitions':
			$('#go-step-definitions-tab').click()
			break
		case 'mocha':
			$('#go-mocha-tab').click()
			break
		case 'solidity':
			$('#go-solidity-tab').click()
			break
	}
}

function isFunction(value) {

	switch (value) {
		case '.HttpProvider(':
		case '.newRequest(':
		case '.ok(':
		case '.writeFile(':
		case '.ifError(':
		case '.at(':
		case '.cwd(':
		case '.stringify(':
		case '.resolve(':
		case '.contract(':
			return false
		default:
			return true
	}

	return value >= 10;
}

