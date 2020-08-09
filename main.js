// Imports 
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const hbs = require("express-handlebars");
const cParser = require("cookie-parser");

// Config


const port = 1337;

// Add CookieParser to the Express App
app.use(cParser());


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
    try{
        if (req.header("Referer").split("/")[3] == "chat"){
            res.render("index", {title: "Home", active: {"home" : true}})
        } else {
            if (req.cookies.usr == null){
                res.render("index", {title: "Home", active: {"home" : true}})
            } else {
                res.redirect("/chat")
            }
        }
    } catch(err) {
        if (req.cookies.usr == null){
            res.render("index", {title: "Home", active: {"home" : true}})
        } else {
            res.redirect("/chat")
        }
    }
    
})

app.get("/chat", (req, res) => {
    if (req.cookies.usr != null){
        res.render('chat', {title: "Chat", active: {"chat": true, "resetRedirect": true}})
    } else {
        res.redirect("/chat")
    }
    
})

io.on("connection", socket => {
    var nick = "";
    socket.on("nickname", (nickname) => {
        nick = nickname;
        console.log(nick + " Connected");
        io.emit("chat message", {usr: "SERVER", msg: nick + " joined the session"} );
    })
    socket.on('disconnect', () => {
        console.log(nick + " Disconnected");
        io.emit("chat message", {usr: "SERVER", msg: nick + " Disconnected"})
    })
    socket.on("chat message", msg => {
        console.log(nick + ": " + msg.msg);
        io.emit("chat message", {usr: nick, msg: msg.msg});
    })
})

http.listen(port, () => {
    console.log(`App is listening on *:${port}`)
})