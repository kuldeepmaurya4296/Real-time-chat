const io = require( "socket.io" )();
const socketapi = {
    io: io
};


var onlineusers = [];

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
   
    socket.on('disconnect', () => {
        console.log("disconnected")
    });

    socket.on('message',function(msg){
        socket.broadcast.emit('message',msg)
    })
    onlineusers.push(socket.id);
    io.emit("online",onlineusers.length)

    io.emit("msg", "connected")

    socket.on('disconnect', () => {
        io.emit("msg", "disconnected")
        onlineusers.splice(onlineusers.indexOf(socket.id),1);
        io.emit("online",onlineusers.length)
    });
    socket.on("msg", function (data) {
        io.emit("msg",data)
    })
});

// end of socket.io logic

module.exports = socketapi;