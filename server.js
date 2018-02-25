const express = require('express')
const app = express()
var path = require('path');
var sql = require("mssql");


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

var config = {
        user: 'commuter',
        password: 'Admin@123',
        server: 'localhost', 
        database: 'vCommute' 
    };

var dbInsertStop = function(name, lat, lng){	
	sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Prepared Statement
        const ps = new sql.PreparedStatement(/* [pool] */)
		ps.input('namePS', sql.VarChar()),
		ps.input('latPS', sql.Float),
		ps.input('langPS', sql.Float)
		ps.prepare("insert into Stops values(NEWID(),'@namePS',@latPS,@langPS)", err => {
		// ... error checks
	 
			ps.execute({namePS: name, latPS: lat, langPS: lang}, (err, result) => {
				// ... error checks
		 
				ps.unprepare(err => {
					// ... error checks
		 
				})
			})
		})       
    });
	
}

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});
	
app.post('/stop', (req, res) => {
	// var data = JSON.parse(req.body);
	var data = req.data;
	console.log(data);
	var routeName = req.body.name;
	var lat = req.body.lat;
	var lang = req.body.lang;
	dbInsertStop(routeName,lat,lang);
	res.send('Hello World!');
})

app.listen(5566, () => console.log('Example app listening on port 5566!'))