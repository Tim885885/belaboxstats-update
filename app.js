import WebSocket from 'ws';
import fs from 'fs';

var socket;
var belaboxStatsState = false;
var belaboxStatsNet = "";
var belaboxStatssensor = "";
var lusStats = "";

socket = new WebSocket("wss://remote.belabox.net/ws/remote")

//Enter your Belabox remote cloud key
var key = "***KEY HERE***"

//Network Status Details
var eth0 = "Chunghwa Telecom"
var eth1 = "eth1"
var eth2 = "eth2"
var eth3 = "eth3"
var eth4 = "eth4"
var wlan0 = "Far EasTone"
var wlan1 = "wlan1"
var wlan2 = "wlan2"
var wlan3 = "wlan3"
var wlan4 = "wlan4"

//Some for localization
var totalspeed = "Total bitrate"
var Soctemperature = "Temperature"
var networkstatusname = "Network Status"

//Some options
var fileupdatetime = 2000;  //File Update Interval min is 1500, 1.5sec, obs's file loading interval is 2 seconds, so 2000 is recommended
var totalspeedison = true; //Show total bitrate (Not completed)
var tempison = true; //Display temperature (Not completed)
var oneline = true; //Display text as a line, not a list (Not completed)

function connect() {
    socket.onopen = function () {
        socket.send(JSON.stringify({ remote: { 'auth/key': { key, version: 6 } } }));
        console.log("Belabox: cloud remote connected.");
        console.log('Belabox: checking authorization.');
    }

    socket.onmessage = function (event) {
        handleMessageBB(JSON.parse(event.data));
    }

    socket.onclose = function (err) {
        console.log("Belabox: remote connection closed");
        socket.send(JSON.stringify({ logout: true }));
        socket.close();
    }

    socket.onerror = function (err) {
        console.log(err)
    }
}

function genNetifEntry(error, enabled, name, ip, throughput, isBold = false) {
    let entry;
    let state = "";
	
	if (name == "eth0") {
		name = eth0;
	}
	
	if (name == "eth1") {
		name = eth1;
	}
	
	if (name == "eth2") {
		name = eth2;
	}
	
	if (name == "eth3") {
		name = eth3;
	}
	if (name == "eth4") {
		name = eth4;
	}
	
	if (name == "wlan0") {
		name = wlan0;
	}
	
	if (name == "wlan1") {
		name = wlan1;
	}
	
	if (name == "wlan2") {
		name = wlan2;
	}
	
	if (name == "wlan3") {
		name = wlan3;
	}
	
	if (name == "wlan4") {
		name = wlan4;
	}
	
    entry = (!isBold ? name : totalspeed) + ': ' + throughput + (!isBold ? '' : '');
    if (error) {
        console.log("Belabox: " + error);
    }
    return entry;
}

function updateNetif(netifs) {
    let modemList = [];
    let totalKbps = 0;
    let data;
    let tpKbps;

    for (const i in netifs) {
        data = netifs[i];
        tpKbps = Math.round((data['tp'] * 8) / 1024);
        totalKbps += tpKbps;
        modemList.push(genNetifEntry(data.error, data.enabled, i, data.ip, `${tpKbps} Kbps\n`));
    }
    if (Object.keys(netifs).length > 1) {
        modemList.push(genNetifEntry(undefined, undefined, '', '', `${totalKbps} Kbps`, true));
    }
    belaboxStatsNet = modemList.join("");
}

function updateSensors(sensors) {
    const sensorList = [];
    let dataS;

    for (const i in sensors) {
        dataS = sensors[i];
        sensorList.push('\n' + Soctemperature + ': ' + dataS);
    }
    belaboxStatssensor = sensorList.join(" ");
}

function showError(message) {
    console.log('Belabox: error: ' + message);
}

function handleRemoteMessage(msg) {
    for (const type in msg) {
        switch (type) {
            case 'auth/key':
            case 'auth/token':
                if (msg[type]) {
                    //hideError();
                    console.log('Belabox: authorized');
                    belaboxStatsState = true;
                } else {
                    belaboxStatsState = false;
                    console.log(`Belabox: invalid access ${type.split('/')[1]}`);
                }
                break;
        }
    }
}

function handleMessageBB(msg) {
    for (const type in msg) {
        switch (type) {
            case 'remote':
                handleRemoteMessage(msg[type]);
                break;
            case 'netif':
                updateNetif(msg[type]);
                break;
            case 'sensors':
                updateSensors(msg[type]);
                break;
            case 'error':
                showError(msg[type].msg);
                break;
        }
    }
}

function connectSetup() {
    var belaboxFileUpdate;
    connect();
    setInterval(() => {
        if (belaboxStatsState) {
            if (!belaboxStatsNet == "") {
                lusStats = belaboxStatsNet + '';
            }
            if (!belaboxStatssensor == "") {
                lusStats = lusStats + belaboxStatssensor;
            }
            belaboxFileUpdate = networkstatusname + ':\n' + lusStats;
            console.log(belaboxFileUpdate + '\n');
            fs.writeFile('belaboxstats.txt', belaboxFileUpdate, (err) => {
                // In case of a error throw err. 
                if (err) throw err;
            })
        } else {
            belaboxFileUpdate = 'Belabox: connection offline!';
            console.log(belaboxFileUpdate + '\n');
            fs.writeFile('belaboxstats.txt', belaboxFileUpdate, (err) => {
                // In case of a error throw err. 
                if (err) throw err;
            })
        }
        socket.send(JSON.stringify({ logout: true }));
        
    }, fileupdatetime);

}

// cross fingers!
connectSetup();

