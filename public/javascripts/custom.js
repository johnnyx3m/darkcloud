$(document).ready(function() {
  //i used DataTable for the pagination/sorting
  //initial state
  var table = $('#forecast').DataTable({
    "lengthMenu": [[3, 10, 15, -1], [3, 10, 15, "All"]]
  });

  //upon clicking search, it will call a post request to api route that
  //will render on #details if found or not.
  $("#search").click(function(){
    $("#details").html("");
    $(".spinner").show();
    $.post("/api", {action: "lookup",city: $("#city").val(), state: $("#state").val()}, function(data, status){
      $(".spinner").hide();
      $("#details").html(data);
    });
    return false;
  });

  //every click on the table row, queries to database by id and render on #details
  $('#forecast tbody').on('click', 'tr td', function () {
    $(".spinner").show();
    $.get("/api/"+this.id, function(data){
      $(".spinner").hide();
      $("#details").html(data);
    })
  } );

  //clicking fetch-latest will find all saved forecast by city and state
  //it will send request to WU for a lookup per record and updates db to latest.
  $("#fetch-latest").click(function(){
    $("table#forecast tbody").html("<div class='spinner'></div>");
    $.get("/api/?action=fetch-latest",(data,status) =>{
      $("table#forecast tbody").html(data);
    })
    return false;
  })

});
