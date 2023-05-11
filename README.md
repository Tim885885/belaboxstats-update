# Fetch Belabox stats from remote cloud and save to file.

This allows for customizing the name of each network individually, along with the localization of the rest of the text.


Node is required. can be found here: https://nodejs.org/en/download/

Setup:
1. Edit `app.js` and put your remote cloud key in `var key = "***KEY HERE***"`
2. edit `var eth0 = "***You network name***"` or var `wlan0 = "***You network Name***"` etc.
3. Run `npm i `

Running the app:
1. In the same folder, run `node app.js`

A file `belaboxstats.txt` will be created in this folder. That will contain the output of the app.

If it connected okay to the remote, the file will contain like:
Network Status:
Chunghwa Telecom: 5 Kbps
Asia Pacific: 0 Kbps
Taiwan Mobile: 0 Kbps
Far EasTone: 0 Kbps
Total bitrate: 5 Kbps
Temperature: 37.0 °C

in OBS
1.Create text
2.Select from file
3.selected belaboxstats.txt
This way, you will have real-time network status information from Belabox on your OBS.

if it could not connect to the remote or key wrong, the file will contain `Belabox: connection offline!`


