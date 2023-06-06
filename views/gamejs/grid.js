import{Cell} from './cell.js'
export class Grid{
   constructor(element){
      this.cells = [];
      for(let y=0; y<4;y++){
         for(let x=0;x<4;x++){
            this.cells.push(new Cell(element,x,y));
         }
      }
      this.cellsGroupColumn = this.GroupColumn()
      this.cellsGroupColumnReverse = this.cellsGroupColumn.map(column=>[...column].reverse());

      this.cellsGroupRow = this.GroupRow()
      this.cellsGroupRowReverse = this.cellsGroupRow.map(row=>[...row].reverse());
   }
   addNumber(number){
      let emptyCells = this.cells.filter(cell=>cell.isNull());
      let randIndex = Math.floor(Math.random()*emptyCells.length);
      return emptyCells[randIndex].bindNumber(number);
   }
   getNumbersData(){
      let number = [];
      for(let cell of this.cells){
         if(typeof(cell.bindedNumber)==="undefined"){continue}
         number.push(cell.getData());
      }
      return number;
   }
   GroupColumn(){
      return this.cells.reduce((result,cell)=>{
         result[cell.x] = result[cell.x] || [];
         result[cell.x][cell.y] = cell;
         return result;
      },[])
   }
   GroupRow(){
      return this.cells.reduce((result,cell)=>{
         result[cell.y] = result[cell.y] || [];
         result[cell.y][cell.x] = cell;
         return result;
      },[])
   }
   setCell(x,y,num){
      this.cellsGroupRow[y][x].bindNumber(num);
   }
}