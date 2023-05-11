# Fetch Belabox stats from remote cloud and save to file.

Node is required.
Node js can be found here: https://nodejs.org/en/download/

Setup:
1. Edit `app.js` and put your remote cloud key in `var key = "***KEY HERE***"`
2. Run `npm i `

Running the app:
1. In the same folder, run `node app.js`

A file `belaboxstats.txt` will be created in this folder. That will contain the output of the app.

If it connected okay to the remote, the file will contain e.g. 
`NetWork:
eth0: 5360 Kbps
wlan0: 4490 Kbps
Total bitrate: 9850
temperature: 37 °C
`

if it could not connect to the remote or key wrong, the file will contain `Belabox: connection offline!`


