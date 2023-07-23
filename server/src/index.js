//@ts-check
import { clientId, clientSecret, port, redirectUri } from "../config.js";
import { Server } from "socket.io"
import http from 'http';
import {oauth} from './init.js'
import SocketUser from "./components/SocketUser.js";

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET"]
    }
});

io.on("connection", (socket) => {
    const {token, code} = socket.handshake.query;
    if(token){
        SocketUser.connection(socket, String(token))
    }else if(code){
        oauth.tokenRequest({
            clientId,
            clientSecret,
        
            code: String(code),
            scope: "identify",
            grantType: "authorization_code",
        
            redirectUri,
        }).then(token => {
            socket.emit("discordToken", token.access_token)
            SocketUser.connection(socket, token.access_token)
        }).catch(err => {
            socket.emit("log-in", false)
        })
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
