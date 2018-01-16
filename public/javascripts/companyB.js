$(function (){
    if($('#B_ID').text()){
        $('.in').show()
        $('.out').hide()
    }
    else{
        $('.in').hide()
        $('.out').show()
    }
    $("#signin").click(function(){
        console.log($('#in_account').val())
        console.log($('#in_password').val())
        $.post('/signinB',{
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
    $("#signup").click(function(){
        $.post('/signupB',{
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