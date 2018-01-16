$(function (){
    if($('#A_ID').text()){
        $('.in').show()
        $('.out').hide()
    }
    else{
        $('.in').hide()
        $('.out').show()
    }
    $("#sign_in").click(function(){
        console.log($('#in_account').val())
        console.log($('#in_password').val())
        $.post('/signinA',{
            account:$('#in_account').val(),
            password:$('#in_password').val()
        },(result)=>{
            if(result.type == 1){
                location.reload()
            }
            else if(result.type == 2){
                alert('密碼錯誤')
            }
            else{
                alert('查無帳號')
            }
        })
    })
    $("#sign_up").click(function(){
        $.post('/signupA',{
            account:$('#up_account').val(),
            password:$('#up_password').val()
        },(result)=>{
            if(result.type == 1){
                location.reload()
            }
            else{
                alert('此帳號已註冊')
            }
        })
    })
})