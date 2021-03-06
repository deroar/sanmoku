var express = require('express'),
	app = module.exports = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session);

var sanmoku = require('./routes/sanmoku'),
	login = require('./routes/login'),
	room = require('./routes/room'),
	path = require('path'),
	routes = require('./routes/index');

var server = require('http').Server(app),
	io = require('socket.io')(server);

var user = [];

//middleware
app.use(morgan({
	format : 'dev',
	immediate : true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(session({
	secret : 'secret',
	store : new mongoStore({
		db : 'session',
		host : 'localhost',
		clear_interval : 60 * 60
	}),
	cookie : {
		httpOnly : false,
		maxAge : new Date(Date.now() + 60 * 60 * 1000)
	}
}));

//listen server
server.listen(5000);
console.log("server starting...");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


var loginCheck = function(req, res, next) {

	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// ログイン画面

app.set('view engine', 'ejs');

app.get('/', loginCheck, routes.index);

app.get('/login', routes.login);

app.post('/add', routes.add);

app.get('/logout', function(req, res) {
	req.session.destroy();
	console.log('deleted session');
	res.redirect('/');
});

/*
app.get('/', login.index);
*/
// room画面
app.post('/room', room.index);

// 三目並べ画面
app.get('/game', sanmoku.index);

// ○ or ×
app.post('/pick', sanmoku.pick);

// socket connect
io.sockets.on('connection', function(socket) {

	// 接続時
	socket.on('connected', function(data) {
		console.log("socket.io >> " + socket.id);
		var msg = data + " さんが入室しました";
		user.push(data);
		io.sockets.emit("publish", {
			value : msg
		});
	});

	// メッセージ送信
	socket.on('publish', function(data) {
		io.sockets.emit("publish", {
			value : data.value
		});
	});

	// 画面データの共有
	socket.on('screenShare', function(data) {
		console.log("server >> screenshare get");
		io.sockets.emit("screenGet", data);
	});

	// 勝負結果の共有
	socket.on('resultShare', function(data) {
		io.sockets.emit("result", data);
	});

	// 接続解除
	socket.on('disconnect', function(data) {
		// var msg = data + " さんが退出しました";
		// io.sockets.emit("publish",{value: msg})
	});

});
