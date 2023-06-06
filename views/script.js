import{start} from"./scriptGame.js"

var main = document.querySelector("div.main");
var choice = document.querySelector("div.choice");
var onlineElem = document.querySelector("div.online");
var game = document.createElement("div");
var token = undefined;
var roomTk = undefined;
var host = false;
game.classList.add("gameField");

function singl(){
   choice.style["display"] = "none";
   main.append(game);
   start();
}
async function getGame(token){
   let startGameData;
   if(!host){
      await fetch(`/api/getGame/${token}`).then(resp=>resp.json()).then(data=>startGameData=data);
      if(startGameData.status==="ok"){
         start(true,startGameData.roomTk,false,startGameData.data)
         return;
      }else{
         setTimeout(()=>{getGame(token)},1000);
      }
   }
   return 0;
}
async function online(){
   choice.style["display"] = "none";
   main.append(game);
   onlineElem.classList.remove("noView");
   await fetch("/api/getToken")
         .then(resp => resp.text())
         .then(data=>{token = data;});
   
   document.querySelector("div.token").textContent = token;
   getGame(token);
   document.querySelector("div.sendToken").addEventListener("click",createRoom,{once:true});
}
async function createRoom(){
   let playerTwoToken = document.querySelector("input.inputToken").value;
   if(playerTwoToken === ''){
      alert("Ошибка");
      return;
   }
   await fetch(`/api/createRoom/${token}/${playerTwoToken}`)
         .then(resp => resp.text())
         .then(data=>{roomTk = data; 
                      host = true;});
   if(roomTk==="555"){
      alert("Ошибка")
      document.querySelector("div.sendToken").addEventListener("click",createRoom,{once:true});
      return;
   }
   start(true,roomTk,host);
}
window.onload=function(){
   game.classList.add("noView");
   onlineElem.classList.add("noView");
   document.getElementById("sn").addEventListener("click",singl,{once:true});
   document.getElementById("ml").addEventListener("click",online,{once:true});
}
 window.onbeforeunload = async function(){
   if(typeof(token)!=="undefined"){
     await this.fetch(`/api/deleteToken/${token}`);
   }
 };