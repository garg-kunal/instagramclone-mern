const express =require('express');
const bodyParser=require('body-parser');
const app=express();

const port=5000||process.env.PORT

app.use(port,(req,res)=>{
    console.log("server run at: "+port);
})
