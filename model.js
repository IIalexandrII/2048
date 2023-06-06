const id = require('uid');

class gameModel{
   constructor(){
      this.players=new Map();
      this.rooms=new Map();
   }
   getToken(){
      let token = id.uid(8);
      while(this.players.has(token)){
         token = id.uid(8);
      }
      let player = {expects: true,
                    step:false,
                    value:undefined
                  };
      this.players.set(token,player);
      return token;
   }
   deleteRoom(token){
      for(let [key,value] of this.rooms){
         if(value.player1===token || value.player2===token){
            this.rooms.delete(key);
            break;
         }
      }
   }
   deleteToken(token){
      this.players.delete(token);
      this.deleteRoom(token);
   }
   createRoom(playerOneToken, playerTwoToken){
      if(this.players.has(playerOneToken) && this.players.has(playerTwoToken) && playerOneToken!==playerTwoToken){
         let tokenRm = id.uid(10);
         while(this.rooms.has(tokenRm)){
            tokenRm = id.uid(10);
         }
         let room = {
            player1: playerOneToken,
            player2: playerTwoToken,
            start: null
         };
         let host = this.players.get(playerOneToken);
         host.expects=false;
         host.step = true;
         this.players.set(playerOneToken,host);

         let player2 = this.players.get(playerTwoToken);
         player2.expects=false;
         this.players.set(playerTwoToken,player2);
         this.rooms.set(tokenRm,room);
         return {tokenRoom:tokenRm, status:true};
      }
      return {status:false};
   }
   createGame(data){
      let room = this.rooms.get(data.roomTk);
      room.start = data.fieldData;
      this.rooms.set(data.roomTk,room);
   }
   getGame(token){
      let roomTk = undefined;
      for(let [key, value] of this.rooms){
         if(value.player1===token || value.player2===token){
            roomTk = key;
            break;
         }
      }
      if(typeof(roomTk)==="undefined"){return 0;}
      let startNumbers = this.rooms.get(roomTk).start;
      console.log("71 model.js: ",startNumbers[0]);
      return{ 
            status:"ok",
            roomTk:roomTk,
            data:startNumbers};
   }
}


module.exports={gameModel}