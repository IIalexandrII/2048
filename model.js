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
                    value:0
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
            start: null,
            move: undefined,
            thisNum:undefined
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
      if(!this.rooms.has(data.roomTk)){return false;}
      let room = this.rooms.get(data.roomTk);
      room.start = data.fieldData;
      this.rooms.set(data.roomTk,room);
      return true;
   }
   getGame(token){
      if(!this.players.has(token)){return 0;}
      let roomTk = undefined;
      for(let [key, value] of this.rooms){
         if(value.player1===token || value.player2===token){
            roomTk = key;
            break;
         }
      }
      if(typeof(roomTk)==="undefined"){return 0;}
      let startNumbers = this.rooms.get(roomTk).start;
      return{ 
            status:"ok",
            roomTk:roomTk,
            data:startNumbers};
   }
   canMove(token, roomTk){
      if((!this.rooms.has(roomTk))||(!this.players.has(token))){return 0;}
      let room = this.rooms.get(roomTk);
      let player1 = room.player1, player2 = room.player2;
      let secondToken;
      if(token===player1){
         secondToken = player2;
      }else{
         secondToken = player1;
      }
      let result = {canStep: this.players.get(token).step,
                    num: this.rooms.get(roomTk).thisNum,
                    move: this.rooms.get(roomTk).move,
                    valueEnemy:this.players.get(secondToken).value,
                    status:"ok"
                  };
      return result;
   }
   setStep(data){
      if((!this.rooms.has(data.roomTk))||(!this.players.has(data.token))){return 22;}
      let room = this.rooms.get(data.roomTk);
      room.thisNum = data.num;
      room.move = data.move;
      this.rooms.set(data.roomTk,room);

      let player = this.players.get(data.token);
      player.step = false;
      player.value = data.maxValue;
      if(data.maxValue>=2048){
         return 5;
      }
      this.players.set(data.token,player);

      let player1 = room.player1, player2 = room.player2;
      let secondToken;
      if(data.token===player1){
         secondToken = player2;
      }else{
         secondToken = player1;
      }
      player = this.players.get(secondToken);
      player.step = true;
      this.players.set(secondToken,player);
      return 0;
   }
}


module.exports={gameModel}