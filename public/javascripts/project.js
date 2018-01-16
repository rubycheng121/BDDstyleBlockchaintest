$(function () {

    update()

    //建立新project
    $('#new_project-button').click(function () {

        if (!$('#project_name').val()) {
            swal({
                title: 'Project Name不能為空',
                type: 'error',
            })
            return
        }

        let contract = {}
        $('div.contract').each(function (index) {
            let contract_name = $(this).find('.contract_name').val()
            contract[contract_name] = []
	    console.log(contract_name)
            $(this).find('.instance_name').each(function (index){
		console.log($(this).val())
                contract[contract_name].push($(this).val())
            })
        })

        $.post('project/' + $('#project_name').val(), {
            contract: JSON.stringify(contract)
        }, (result) => {
            if (result.type) {
                swal({
                    title: result.inf,
                    type: 'success',
                })
            }
            else {
                swal({
                    title: result.inf,
                    type: 'warning',
                })
            }
            update()
        })
    })

    //新增contract
    $('#add_contract-button').click(function () {
        $('#contract-template').children().clone().addClass('contract').appendTo('#project-tab .form-inline')
    }).click()

    //新密碼
    $('#update_password').click(function () {
        if ($('#new_password1').val() == $('#new_password2').val()) {
            //密碼長度8-16 大小寫數字
            let reg = /^\S{6,20}$/
            if (!reg.test($('#new_password1').val())) {
                swal({
                    title: '新密碼格式錯誤\n長度6-20 非空白字元',
                    type: 'warning',
                })
                return
            }

            $.post('users/update_password', {
                old_password: $('#old_password').val(),
                new_password: $('#new_password1').val(),
            }, (result) => {
                if (result.type) {
                    swal({
                        title: result.inf,
                        type: 'success',
                    })
                }
                else {
                    swal({
                        title: result.inf,
                        type: 'warning',
                    })
                }
            })
        }
        else {
            swal({
                title: '兩次密碼不樣',
                type: 'warning',
            })
        }
    })

    //新API KEY
    $('#re_api_key').click(function () {
        swal({
            title: '產生新的API KEY',
            type: 'question',
            showCancelButton: true
        }).then(() => {
            $.get('reGenerateApiKey', function (result) {
                $('#api_key').val(result)
            })
        }).catch(() => { })
    })

})

//新增instance
function new_deploy(but) {
    $(but).before($('#instance-template').children().clone())
}

function remove(item, n) {
    if (n == 1) {
        $(item).parent().parent().remove();
    }
    else {
        $(item).parent().remove();
    }
}

function update() {

    $.get("projectList", function (result) {

        $('#project_list').empty()

        for (let i in result) {
            $('#project_list').append(
                '<div class="panel panel-info">' +
                '<div class="panel-heading" style="height:5rem" >' +
                '<a style="float:left; text-align:left" href="editor/' + result[i].project + '">' +
                '<h4 style="padding-top:10px" class="list-group-item-heading">' + result[i].project + '</h4>' +
                '</a>' +
                '<button style="float:right; text-align:right" type="button" class="btn btn-default delete" aria-label="Left Align">' +
                'delete' +
                '</button>' +
                '</div>' +
                '<div class="panel-body">' +
                '<p class="list-group-item-text">Create date : ' + new Date(result[i].create_date).toLocaleString() + '</p>' +
                '<p class="list-group-item-text">Last update : ' + new Date(result[i].last_update).toLocaleString() + '</p>' +
                '</div>' +
                '</div>');
        }

        $('.delete').click(function () {
            swal({
                title: '確認刪除' + $(this).parent('.panel-heading').children('a').text(),
                type: 'question',
                showCancelButton: true
            }).then(() => {
                $.ajax({
                    url: 'project/' + $(this).parent('.panel-heading').children('a').text(),
                    type: 'DELETE',
                    data: {},
                    success: function (result) {
                        console.log(result)
                        update()
                    }
                })
            }).catch(() => { })
        })
    })
}
