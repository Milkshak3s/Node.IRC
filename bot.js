var net = require('net'),
    readline = require('readline');

var sock = net.Socket();

var channel = '#jules99',
    version = '0.2a',
    debug = 'Active';

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

        //Hi's and hello
        switch (msg.value) {
            case 'hi':
            case 'Hi':
            case 'Hello':
            case 'hello':
                sock.write('PRIVMSG ' + channel + ' :Hello, ' + msg.nick + '\n\r');
                console.log('PRIVMSG ' + channel + ' :Hello, ' + msg.nick);
                break;
            default:
                break;
        }

        //Info and debugging
        switch (msg.value) {
            case '!commands':
                sock.write('PRIVMSG' + channel + ' :Hi, !commands, !version, !channel, !status, !SCP 001')
                break;
            case '!version':
                sock.write('PRIVMSG ' + channel + ' :' + version + '\n\r');
                console.log('Version Requested');
                console.log('PRIVMSG ' + channel + ' :' + version);
                break;
            case '!channel':
                sock.write('PRIVMSG ' + channel + ' :' + channel + '\n\r');
                console.log('Channel Requested');
                console.log('PRIVMSG ' + channel + ' :' + channel);
                break;
            case '!status':
                sock.write('PRIVMSG ' + channel + ' :' + 'Connected to channel: ' + channel + ' Debug is: ' + debug + '\n\r');
                console.log('Status Requested');
                console.log('PRIVMSG ' + channel + ' :' + 'Connected to channel: ' + channel + ' Debug is: ' + debug);
                break;
            default:
                break;
        }

        //SCP info
        switch (msg.value) {
            case '!SCP 001':
                sock.write('PRIVMSG ' + channel + ' :CLASSIFIED' + '\n\r');
                console.log('PRIVMSG ' + channel + ' :CLASSIFIED');
                break;
            default:
                break;

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
