// Floating Hearts

const bg=document.querySelector(".background-hearts");

for(let i=0;i<35;i++){

const heart=document.createElement("div");

heart.className="heart";

heart.innerHTML="❤";

heart.style.left=Math.random()*100+"vw";

heart.style.fontSize=(15+Math.random()*25)+"px";

heart.style.animationDuration=(5+Math.random()*8)+"s";

heart.style.animationDelay=Math.random()*6+"s";

bg.appendChild(heart);

}

// Gift

const gift=document.getElementById("giftBox");

const menu=document.getElementById("menu");

gift.onclick=()=>{

gift.style.transform="scale(.85) rotate(12deg)";

gift.style.display="none";

confetti({

particleCount:250,

spread:180,

origin:{y:.6},

colors:["#1E90FF","#6495ED","#4169E1","#87CEEB","#B0E0E6"]

});

setTimeout(()=>{

menu.style.display="grid";

},500);

}