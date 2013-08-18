var net = require('net'),
    readline = require('readline');

var sock = net.Socket();

function parseMsg(line) {
	line = line.trim();
	var prefix = '',
	    command = '',
	    args = [],
	    nick = '',
	    value = '';
	if (line[0] == ':') {
		prefix = line.substring(1, line.indexOf(' '));
		line = line.substr(line.indexOf(' ') + 1);
		if (prefix.indexOf('!') != -1) {
			nick = prefix.substring(0, prefix.indexOf('!'));
		}
	}
	
	command = line.substring(0, line.indexOf(' '));
	line = line.substr(line.indexOf(' ') + 1);
			
	if (line[0] == ":") {
		value = line.substring(1);
	}	
	else {
		if (line.indexOf(':') != -1) {
			args = line.substring(0, line.indexOf(':')).split(' ')
			value = line.substr(line.indexOf(':') + 1);
		}
		else {
			args = line.split(' ');
		}
	}	
	
	return {
		prefix: prefix,
		nick: nick,
		command: command,
		args: args,
		value: value
	}
};

sock.connect(6667, 'irc.freenode.net', function () {
	var rl = readline.createInterface({
		input: sock,
		output: sock
	});
	rl.on('line', function (line) {
		console.log(line.trim());
		var msg = parseMsg(line);
		console.log('Prefix: ' + msg.prefix);
		console.log('Nick:   ' + msg.nick);
		console.log('Command:' + msg.command)
		console.log('Args:   ' + msg.args.join(', '));
		console.log('Value:  ' + msg.value);
		console.log(' '); 
		
		if (msg.value == 'hi') {
			sock.write('PRIVMSG ' + '#jules99' + ' :Hello, ' + msg.nick + '\n\r');
			console.log('PRIVMSG ' + '#jules99' + ' :Hello, ' + msg.nick);
		}
		
		switch (msg.command) {
			case 'PING':
				sock.write('PONG :' + msg.value);
				console.log('PONG :' + msg.value);
				break;
		}
	});
	sock.write('NICK SkidBot_1227\r\n');
	console.log('NICK SkidBot_1227');
	sock.write('USER TheSkidBot_1227 8 * :The SkidBot_1227\r\n');
	console.log('USER TheSkidBot_1227 8 * :The SkidBot_1227');
	sock.write('JOIN #jules99\r\n');
	console.log('JOIN #jules99')
});
