import { Grid } from "./gamejs/grid.js";
import { Number } from "./gamejs/number.js";

var field, grid ,gameData={step:false,host:false,token:undefined, roomTk:undefined, newNum:undefined, online:false}, aw = true;

function moveNumbers(columns){
   for (let column of columns){
      for(let i=1;i<4;i++){
         if(column[i].isNull()){
            continue;
         }
         let cellForShear = column[i];
         let desiredCell, y=i-1;
         while(y>=0 && column[y].isCanShear(cellForShear.bindedNumber)){
            desiredCell = column[y];
            y -= 1; 
         }
         
         if(typeof(desiredCell)=='undefined'){
            continue;
         }
         
         if(desiredCell.isNull()){
            desiredCell.bindNumber(cellForShear.bindedNumber);
         }else{
            desiredCell.sumBindNumber(cellForShear.bindedNumber);
         }
         cellForShear.unbind();
      }
   }
   for(let cell of grid.cells){
      if(cell.hasNumForShear()){
         cell.sum();
      }
   }
}

function moveUp(){
   let columns = grid.cellsGroupColumn;
   moveNumbers(columns);
}
function moveDown(){
   let columns = grid.cellsGroupColumnReverse;
   moveNumbers(columns);
}
function moveLeft(){
   let rows = grid.cellsGroupRow;
   moveNumbers(rows);
}
function moveRight(){
   let rows = grid.cellsGroupRowReverse;
   moveNumbers(rows);
}

function canMoveGr(gr){
   return gr.some((cell,index)=>{
      if(index === 0){
         return false;
      }
      if(cell.isNull()){
         return false;
      }
      return gr[index-1].isCanShear(cell.bindedNumber)
   });
}
function canMove(grCells){
   return grCells.some(gr => canMoveGr(gr));
}
function canMoveUp(){
   return canMove(grid.cellsGroupColumn);
}
function canMoveDown(){
   return canMove(grid.cellsGroupColumnReverse);
}
function canMoveLeft(){
   return canMove(grid.cellsGroupRow);
}
function canMoveRight(){
   return canMove(grid.cellsGroupRowReverse);
}

function move(event){
   if(gameData.online){
      if(gameData.step){
         let thisMove;
         switch(event.key){
            case "ArrowUp":
               if(!canMoveUp()){
                  window.addEventListener("keydown",move,{once:true});
                  return;
               }
               moveUp();
               thisMove = "up";
               break;
            case "ArrowDown":
               if(!canMoveDown()){
                  window.addEventListener("keydown",move,{once:true});
                  return;
               }
               moveDown();
               thisMove = "down";
               break;
            case "ArrowLeft":
               if(!canMoveLeft()){
                  window.addEventListener("keydown",move,{once:true});
                  return;
               }
               moveLeft();
               thisMove = "left";
               break;
            case "ArrowRight":
               if(!canMoveRight()){
                  window.addEventListener("keydown",move,{once:true});
                  return;
               }
               moveRight();
               thisMove = "right";
               break;
            default:
               window.addEventListener("keydown",move,{once:true});
               return;
         }
         gameData.step = false;
         setTimeout(()=>{
            let number = new Number(field);
            let dataNum = grid.addNumber(number);
            gameData.newNum = dataNum;
            sendStep(gameData.token, gameData.roomTk, thisMove);
            if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
               alert("упс, ходы кончиличь");
               return;
            }
         },240);
         if(aw){
            aw = false;
            waitStep();
         }
      }
   }else{
      switch(event.key){
         case "ArrowUp":
            if(!canMoveUp()){
               window.addEventListener("keydown",move,{once:true});
               return;
            }
            moveUp();
            break;
         case "ArrowDown":
            if(!canMoveDown()){
               window.addEventListener("keydown",move,{once:true});
               return;
            }
            moveDown();
            break;
         case "ArrowLeft":
            if(!canMoveLeft()){
               window.addEventListener("keydown",move,{once:true});
               return;
            }
            moveLeft();
            break;
         case "ArrowRight":
            if(!canMoveRight()){
               window.addEventListener("keydown",move,{once:true});
               return;
            }
            moveRight();
            break;
         default:
            window.addEventListener("keydown",move,{once:true});
            return;
      }
      setTimeout(()=>{
         grid.addNumber(new Number(field))
         window.addEventListener("keydown",move,{once:true});
         if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
            alert("упс, ходы кончиличь");
            return;
         }
      },240);
   }
}
async function sendStep(token, roomTk, thisMove){
   let data = {
      token:token,
      roomTk:roomTk,
      move:thisMove,
      num:gameData.newNum
   };
   await fetch("/api/setStep",{
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/plain, */*',
         'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
   })
}  
async function waitStep(){
   console.log("я жду");
   let num,thisMove;
   await fetch(`/api/canMove/${gameData.token}/${gameData.roomTk}`)
               .then(resp=>resp.json())
               .then(data=>{
                  console.log("asdasdasdasdasdassd",data)
                  gameData.step=data.canStep; // false,true
                  num = data.num;             // {x:,y:,value}
                  thisMove = data.move;
               });          
   if(gameData.step && typeof(num)!=="undefined"){
      switch(thisMove){
         case "up":
            moveUp();
            break;
         case "down":
            moveDown();
            break;
         case "left":
            moveLeft();
            break;
         case "right":
            moveRight();
            break;
      }
      let number = new Number(field);
      number.setValue(num.value)
      grid.setCell(num.x, num.y,  number);
      window.addEventListener("keydown",move,{once:true});
      aw = true;
      return;
   }else{
      setTimeout(waitStep,200);
   }
}

async function createGame(online,dataStart=undefined){
   field = document.querySelector("div.gameField");
   grid = new Grid(field);
   gameData.online = online;
   if(online){
      if(gameData.host){
         console.log("я хост");
         grid.addNumber(new Number(field));
         grid.addNumber(new Number(field));
         let data = grid.getNumbersData();
         window.addEventListener("keydown",move,{once:true});
         return data;
      }else{
         console.log("я друг",dataStart[0].x,dataStart[0].y);
         let numbers = [new Number(field), new Number(field)];
         console.log(dataStart[0].x, dataStart[0].y);
         numbers[0].setValue(dataStart[0].value);
         numbers[1].setValue(dataStart[1].value);

         grid.setCell(dataStart[0].x, dataStart[0].y,numbers[0]);
         grid.setCell(dataStart[1].x, dataStart[1].y,numbers[1]);
         waitStep();
      }
   }else{
      grid.addNumber(new Number(field));
      grid.addNumber(new Number(field));
      window.addEventListener("keydown",move,{once:true});
   }
}
export async function start(online=false,roomTk=undefined,host=false,dataStart=null,token=undefined){
   if(online){
      gameData.roomTk=roomTk;
      gameData.token=token;
      if(host){
         gameData.host = host;
         gameData.step = true;
         let startD = await createGame(online)
         let data = {fieldData: startD,
                     roomTk: roomTk};
         await fetch('/api/createGame', {
            method: 'POST',
            headers: {
               'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
         });
         window.addEventListener("keydown",move,{once:true});
      }else{
         await createGame(online,dataStart);
      }
      
   }else{
      createGame(online);
      window.addEventListener("keydown",move,{once:true});
   }
}
