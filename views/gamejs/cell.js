export class Cell{
   constructor(elem,x,y){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      elem.append(cell);

      this.x=x;
      this.y=y;
   }
   getData(){
      if(this.isNull()){return}
      return this.bindedNumber.getData();
   }
   bindNumber(number){
      number.setCord(this.x,this.y);
      this.bindedNumber = number;
      return {
         x: this.x,
         y: this.y,
         value: number.value};
   }
   isNull(){
      if(typeof(this.bindedNumber)!=='undefined'){
         return false;
      }
      return true;
   }
   unbind(){
      this.bindedNumber=undefined;
   }
   sumBindNumber(number){
      number.setCord(this.x,this.y);
      this.newBindedNumber=number;
   }

   hasNumForShear(){
      if(typeof(this.newBindedNumber)!=='undefined'){
         return true;
      }
      return false;
   }

   isCanShear(newNumber){
      if(this.isNull()){
         return true;
      }else{
         if(!this.hasNumForShear() && this.bindedNumber.value == newNumber.value){
            return true;
         }
      }
      return false;
   }
   sum(){
      this.bindedNumber.setValue(this.bindedNumber.value*2);
      this.newBindedNumber.num.remove();
      this.newBindedNumber = undefined;
   }
}