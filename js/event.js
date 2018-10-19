// 首頁專用js
$(function(){
    makePic()
})

function makePic(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("bgpost");

    ctx.drawImage(img, 0, 0, 755, 395);
    ctx.font = "30px Arial";
    ctx.fillText("張小掰", 10, 50);

    var dataURL = c.toDataURL('image/jpeg');
    console.log(dataURL);

   
}