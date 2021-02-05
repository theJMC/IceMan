# IceMan Message Board

The IceMan Project a Central Message Board System. It is inteded to be used in conjuction with a VPN connection to a central server (e.g. WireGuard) 

## How It Works:

It uses the [ExpressJS](https://expressjs.com) Library to create a Web front, [Express Handlebars](https://www.npmjs.com/package/express-handlebars) as the template manager, and [Socket.io](https://socket.io) as the connection manager between the clients and server.

# Routes:

## `/` (Root) Route:
The `/` Route is a simple textbox, that takes a name, and once it has the name, it assigns it to a cookie and sends to the `/chat` route

## `/chat` Route:
It sends the client to the chat box, and alerts the socket that a new client joined the system.

