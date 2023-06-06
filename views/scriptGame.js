import { Grid } from "./gamejs/grid.js";
import { Number } from "./gamejs/number.js";

var field, grid;

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
      grid.addNumber(new Number(field));
      window.addEventListener("keydown",move,{once:true});
      if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
         alert("упс, ходы кончиличь");
         return;
      }
   },240);
}

function createGame(dataStart=undefined){
   field = document.querySelector("div.gameField");
   grid = new Grid(field);
   if(typeof(dataStart)==="undefined"){
      console.log("я хост");
      grid.addNumber(new Number(field));
      grid.addNumber(new Number(field));
      let data = grid.getNumbersData();
      return data;
   }else{
      console.log("я друг",dataStart[0].x,dataStart[0].y);
      let numbers = [new Number(field), new Number(field)];
      console.log(dataStart[0].x, dataStart[0].y);
      numbers[0].setValue(dataStart[0].value);
      numbers[1].setValue(dataStart[1].value);

      grid.setCell(dataStart[0].x, dataStart[0].y,numbers[0]);
      grid.setCell(dataStart[1].x, dataStart[1].y,numbers[1]);
   }
}
export function start(online=false,roomTk=undefined,host=false,dataStart=null){
   if(online){
      if(host){
         let startD = createGame()
         let data = {fieldData: startD,
                     roomTk: roomTk};
         fetch('/api/createGame', {
            method: 'POST',
            headers: {
               'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
         });
         window.addEventListener("keydown",move,{once:true});
      }else{
         createGame(dataStart);
      }
   }else{
      createGame();
      window.addEventListener("keydown",move,{once:true});
   }
}