export class Number{
   constructor(fildElem){
      this.num = document.createElement("div");
      this.num.classList.add('number')
      this.setValue(Math.random()>0.5 ? 2:4);
      fildElem.append(this.num);
   }
   setCord(x,y){
      this.x=x;
      this.y=y;

      this.num.style.setProperty("--x",x)
      this.num.style.setProperty("--y",y)
   }
   setValue(value){
      this.value = value;
      this.num.textContent = this.value;
      this.num.style.setProperty('--bgColor', `${240+(30*Math.log2(value))}deg`); 
   }
   getData(){
      return {x: this.x, 
              y: this.y, 
              value: this.value}
   }
   waitAnim(){
      return new Promise(resolve=>{
         this.num.addEventListener("transitionend",resolve,{once:true});
      })
   }
}