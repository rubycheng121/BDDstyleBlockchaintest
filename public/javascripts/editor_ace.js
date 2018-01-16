var featureEditor
var stepDefinitionsEditor
var solidityEditor
var mochaEditor
var auxiliaryCodeEditor

var $output
var $mochaOutput
var $solidityOutput

$(window).load(function () {

    //set editor
    featureEditor = ace.edit("feature")
    featureEditor.getSession().setMode("ace/mode/gherkin")

    stepDefinitionsEditor = ace.edit("step-definitions")
    stepDefinitionsEditor.getSession().setMode("ace/mode/javascript")

    mochaEditor = ace.edit("mocha")
    mochaEditor.getSession().setMode("ace/mode/javascript")

    solidityEditor = ace.edit("solidity")
    solidityEditor.getSession().setMode("ace/mode/solidity")

    auxiliaryCodeEditor = ace.edit("auxiliaryCode")
    auxiliaryCodeEditor.getSession().setMode("ace/mode/javascript")

    //set output
    $output = $('#output')
    $mochaOutput = $('#mochaOutput')
    $solidityOutput = $('#solidityOutput')

})

//append to editor
function appendToFeatureEditor(data) {
    featureEditor.setValue(data)
    featureEditor.scrollToLine(0)
}
function appendToStepDefinitionsEditor(data) {
    stepDefinitionsEditor.setValue(data)
    stepDefinitionsEditor.scrollToLine(0)
}
function appendToMochaEditor(data) {
    mochaEditor.setValue(data)
    mochaEditor.scrollToLine(0)
}
function appendToSolidityEditor(data) {
    solidityEditor.setValue(data)
    solidityEditor.scrollToLine(0)
}

//append to output
function appendToOutput(data) {
    $output.append(data)
    //$output.scrollTop($output.prop("scrollHeight"))
}
function appendToMochaOutput(data) {
    $mochaOutput.append(data)
    //$mochaOutput.scrollTop($mochaOutput.prop("scrollHeight"))
}
function appendToSolidityOutput(data) {
    $solidityOutput.append(data)
    //$solidityOutput.scrollTop($solidityOutput.prop("scrollHeight"))
}

function displayError(error) {
    var errorContainer = $('<div>')
    errorContainer.addClass('error').text(error.stack || error)
    appendToOutput(errorContainer)
}

