# Fetch Belabox stats from remote cloud and save to file. Eg. Belabox stats: eth0: 5360 Kbps (On). wlan0: 4490 Kbps (On). Total bitrate: 9850 Kbps. SoC temperature 39.0 °C

Node is required.  Node 14 used, should be okay with other versions.
Node js can be found here: https://nodejs.org/en/download/

Setup:
1. Edit `app.js` and put your remote cloud key in `var key = "***KEY HERE***"`
2. Run `npm i `

Running the app:
1. In the same folder, run `node app.js`

A file `belaboxstats.txt` will be created in this folder. That will contain the output of the app.

If it connected okay to the remote, the file will contain e.g. `Belabox stats: eth0: 5360 Kbps (On). wlan0: 4490 Kbps (On). Total bitrate: 9850 `

if it could not connect to the remote or key wrong, the file will contain `Belabox: connection offline!`


