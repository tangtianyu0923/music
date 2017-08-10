var left=document.querySelector(".left");
var right=document.querySelector(".right");
var LIWIDTH=280;
var moved=0;
right.onclick=move;
function move(){
    if(this.className.indexOf("hide")==-1){
        moved+=(
            this.className=="right"?1:-1
        );
        var liMove=moved*-LIWIDTH;
        document.querySelector(".slider>ul").style.left=liMove+"px";
        checkA();
    }
}
left.onclick=move;
function checkA(){
    if(document.querySelector(".slider>ul").children.length-moved==4)
    right.className="right hide";
    else if(moved==0)
    left.className="left hide";
    else{
        right.className="right";
        left.className="left"
    }
}
