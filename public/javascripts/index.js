$(function () {
    $("#sign_in-button").click(function () {
        $.post("users/sign_in", $("#sign_in-form").serialize(), function (result) {
            console.log(result)
            switch (result.type) {
                case 1: {
                    swal({
                        title: result.inf,
                        text: '網頁即將導向專案管理頁面',
                        type: 'success',
                        closeOnConfirm: false
                    }).then(() => {
                        window.location = '/'
                    })
                    break
                }
                case 2: {
                    swal({
                        title: result.inf,
                        text: '請重新輸入密碼',
                        type: 'warning'
                    })
                    break
                }
                case 0: {
                    swal({
                        title: result.inf,
                        text: '請重新輸入帳號',
                        type: 'error'
                    })
                    break
                }
            }
        })
    })

    $('#sign_up-button').click(function () {
        let reg

        //帳號長度6-20 大小寫數字底線
        reg = /^\w{2,20}$/
        if (!reg.test($('#sign_up-form input[name=ID]').val())) {
            swal({
                title: '帳號格式錯誤\n長度6-20 大小寫數字底線',
                type: 'warning',
            })
            return
        }

        //email格式
        reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        if (!reg.test($('#sign_up-form input[name=email]').val())) {
            swal({
                title: 'email格式錯誤',
                type: 'warning',
            })
            return
        }

        //兩次輸入密碼不同
        if ($('#sign_up-form input[name=password]').val() != $('#sign_up-form input[name=re_password]').val()) {
            swal({
                title: '兩次輸入密碼不同',
                type: 'warning',
            })
            return
        }

        //密碼長度6-20 非空白字元
        reg = /^\S{6,20}$/
        if (!reg.test($('#sign_up-form input[name=password]').val())) {
            swal({
                title: '密碼格式錯誤\n長度6-20 非空白字元',
                type: 'warning',
            })
            return
        }

        $.post("users/sign_up", $("#sign_up-form").serialize(), function (result) {
            console.log(result)
            if (result.type)
                swal({
                    title: result.inf,
                    type: 'success',
                }).then(() => {
                    window.location = '/'
                })
            else {
                swal({
                    title: result.inf,
                    type: 'warning',
                })
            }
        })

    })

    $('#reset-button').click(function () {
        $.post("users/sign_up", $("#sign_up-form").serialize(), function (result) {
            console.log(result)
            if (result.type)
                swal({
                    title: result.inf,
                    type: 'success',
                }).then(() => {
                    window.location = '/'
                })
            else {
                swal({
                    title: result.inf,
                    type: 'warning',
                })
            }
        })
    })
})