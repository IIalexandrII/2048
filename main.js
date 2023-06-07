const express = require('express');
const bodyParser = require("body-parser");
const modelGame = require('./model.js');

const app = express();
const hostname="0.0.0.0";
const port = 3000;

app.use(express.static('views'));
const urlencodedParser = express.urlencoded({extended: false});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const model = new modelGame.gameModel();
//-------------
setInterval(()=>{
   console.clear();
   console.log("players: ", model.players);
   console.log("rooms: ", model.rooms)},10000);
//-------------
app.set('view engine','pug');

app.get('/',urlencodedParser,(req, res)=>{
   res.render("index");
});

app.get('/api/getToken',(req, res)=>{
   res.send(model.getToken());
});
app.get('/api/deleteToken/:tk',(req,res)=>{
   model.deleteToken(req.params.tk);
});
app.get('/api/createRoom/:tkHost/:tkPlayer2',(req,res)=>{
   let result = model.createRoom(req.params.tkHost,req.params.tkPlayer2);
   if(result.status){
      res.send(result.tokenRoom);
   }else{
      res.send("555");
   }
});

//------------------------------------------------------------
app.post('/api/createGame',(req,res)=>{
   let result = model.createGame(req.body);
   if(result)
      res.send({status:"ok"});
   else
      res.send({status:"no"});
});

app.get('/api/getGame/:token',(req,res)=>{
   let data = model.getGame(req.params.token);
   if(data !== 0){
      res.send(JSON.stringify(data))
   }else{
      res.send(JSON.stringify({status:"no"}))
   }
});
app.get('/api/canMove/:token/:roomTk',(req,res)=>{
   let data = model.canMove(req.params.token, req.params.roomTk);
   if(data !== 0){
      res.send(JSON.stringify(data))
   }else{
      res.send(JSON.stringify({status:"no"}))
   }
});
app.post('/api/setStep',(req,res)=>{
   let result = model.setStep(req.body);
   if (result===5){
      res.send(JSON.stringify({status:"win"}));
   }else if(result===0){
      res.send(JSON.stringify({status:"ok"}));
   }else {
      res.send(JSON.stringify({status:"no"}))
   }
});

app.listen(port,hostname,()=>{console.log("started");});

