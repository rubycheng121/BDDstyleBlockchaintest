$(function () {
    $('#transfer').click(function () {
        $.post('/A2B', {
            account: $('#transTarget').val(),
            points: $('#transPoint').val()
        },(state)=>{
            if (state == 'successfully') {
                location.reload()
            }
        })
    })
    $('#add').click(function () {
        $.post('/addPointA', (state) => {
            if (state == 'successfully') {
                location.reload()
            }
        })
    })
})