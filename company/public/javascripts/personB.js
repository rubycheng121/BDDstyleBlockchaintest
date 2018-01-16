$(function () {
    $('#transfer').click(function () {
        $.post('/B2A', {
            account: $('#transTarget').val(),
            points: $('#transPoint').val()
        },(state)=>{
            if (state == 'successfully') {
                location.reload()
            }
        })
    })
    $('#add').click(function () {
        $.post('/addPointB', (state) => {
            if (state == 'successfully') {
                location.reload()
            }
        })
    })
})