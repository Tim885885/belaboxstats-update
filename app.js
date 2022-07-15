import WebSocket from 'ws';
import fs from 'fs';

var socket;
var belaboxStatsState = false;
var belaboxStatsNet = "";
var belaboxStatssensor = "";
var lusStats = "";

socket = new WebSocket("wss://remote.belabox.net/ws/remote")
var key = "***KEY HERE***"


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

    if (enabled) {
        state = "On";
    } else {
        state = "Off";
    }
    entry = (!isBold ? name : 'Total bitrate') + ': ' + throughput + (!isBold ? ' (' + state + ').' : '');
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
        modemList.push(genNetifEntry(data.error, data.enabled, i, data.ip, `${tpKbps} Kbps`));
    }
    if (Object.keys(netifs).length > 1) {
        modemList.push(genNetifEntry(undefined, undefined, '', '', `${totalKbps} Kbps`, true));
    }
    belaboxStatsNet = modemList.join(" ");
}

function updateSensors(sensors) {
    const sensorList = [];
    let dataS;

    for (const i in sensors) {
        dataS = sensors[i];
        sensorList.push(i + ' ' + dataS);
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
    setTimeout(() => {
        if (belaboxStatsState) {
            if (!belaboxStatsNet == "") {
                lusStats = belaboxStatsNet + '. ';
            }
            if (!belaboxStatssensor == "") {
                lusStats = lusStats + belaboxStatssensor;
            }
            belaboxFileUpdate = 'Belabox stats: ' + lusStats;
            console.log('');
            console.log(belaboxFileUpdate);
            console.log('Belabox: file belaboxstats.txt updated in this folder');
            fs.writeFile('belaboxstats.txt', belaboxFileUpdate, (err) => {
                // In case of a error throw err. 
                if (err) throw err;
            })
            console.log('');
        } else {
            belaboxFileUpdate = 'Belabox: connection offline!';
            console.log(belaboxFileUpdate);
            console.log('Belabox: file belaboxstats.txt updated in this folder');
            console.log('');
            fs.writeFile('belaboxstats.txt', belaboxFileUpdate, (err) => {
                // In case of a error throw err. 
                if (err) throw err;
            })
        }
        //clean up in case
        socket.send(JSON.stringify({ logout: true }));
        socket.close();
    }, 4000);

}

// cross fingers!
connectSetup();

