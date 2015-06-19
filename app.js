var express = require('express'),
<<<<<<< HEAD
	app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    sanmoku = require('./routes/sanmoku'),
    login = require('./routes/login'),
    room = require('./routes/room');

var server = require('http').Server(app),
	io = require('socket.io')(server);
=======
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    app = express(),
    post = require('./routes/post')
;

app.set('views',__dirname + '/views');
app.set('view engine','ejs');
>>>>>>> origin/master

//middleware
app.use(morgan({format: 'dev', immediate: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());

<<<<<<< HEAD
server.listen(3000);
console.log("server starting...");

app.set('views',__dirname + '/views');
app.set('view engine','ejs');



//ログイン画面
app.get('/',login.index);

//room画面
app.post('/room',room.index);

//三目並べ画面
app.get('/game',sanmoku.index);

//○　or　×
app.post('/pick',sanmoku.pick);

//三目並べ初期化
app.post('/init',sanmoku.init);

//socket connect
io.sockets.on('connection',function(socket){

	console.log("socket connection!!");
	//console.log(socket);
	//接続時

	socket.on('connected',function(data){
		var msg = data + " さんが入室しました";
		console.log(msg);
		io.sockets.emit("publish",{value: msg})
	});

	//メッセージ送信
	socket.on('publish', function (data) {
		io.sockets.emit("publish", {value:data.value});
	});

	//接続解除
	socket.on('disconnect', function (data) {
		var msg = data + " さんが退出しました";
		io.sockets.emit("publish",{value: msg})
	});

});
=======
//初期画面
app.get('/',post.index);

//○　or　×
app.post('/pick',post.pick);


//画面初期化
app.post('/init',post.init);

app.listen(3000);
console.log("server starting...");
>>>>>>> origin/master