// Imports 
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const hbs = require("express-handlebars");

// Config


const port = 80;

// Setup Handlebars View Engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views")
app.engine("hbs", hbs({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index"
}))

// Serve folders
app.use(express.static(__dirname + "/public"));

// |-- DEFINING VIEWS --| 

app.get("/", (req, res) => {
    res.render('index', {title: "Chat", active: {"chat": true}})
})

io.on("connection", socket => {
    var nick = "";
    socket.on("nickname", (nickname) => {
        nick = nickname;
        console.log(nick + " Connected");
        io.emit("chat message", nick + " joined the session");
    })
    socket.on('disconnect', () => {
        console.log("User Disconnected");
        io.emit("chat message", nick + " Disconnected")
    })
    socket.on("chat message", msg => {
        console.log(nick + ": " + msg.msg);
        io.emit("chat message", nick + ": " + msg.msg);
    })
})

http.listen(port, () => {
    console.log(`App is listening on *:${port}`)
})