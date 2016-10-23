$(function () {
  $('.del').click(function () {
    var id = $(this).data('id');
    var tr = $("#item-id-"+id);
    $.ajax({
      type:"delete",
      url:'/admin/deleteById?id='+id
    })
      .done(function (results) {
        if(results.success == '1'){
          tr.remove();
        }
      })
  })
})
