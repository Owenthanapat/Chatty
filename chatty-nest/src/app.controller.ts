import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

//wait client data
wss.on('connection', function connection(ws) {
  ws.on('message',function(message) {
    var chat = JSON.parse(message)
    console.log(chat)
    if (chat.type == 'initial')  {
      ws.username = chat.data.name
      ws.channel = chat.data.channel
    }

    if (chat.type == 'message') {
      message = `${ws.username} : ${chat.data}`
      wss.clients.forEach(element => {
        if (element.channel == ws.channel) element.send(message)
      });
    }

    if (chat.type == 'changeChannel') {
      if (ws.channel != chat.data) {
        wss.clients.forEach(element => {
          if (element.channel == ws.channel) element.send(`${ws.username} leaved`)
          if (element.channel == chat.data) element.send(`${ws.username} joined`)
        });
        ws.channel = chat.data
      }
      
    }

    
    //console.log(ws)
    //console.log("----------------------------------------")
    //console.log(wss.clients)
  
    //storee
  })



  ws.on('close', function () {
    console.log("lost"+ws.username)
  })
  
});
