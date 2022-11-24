const fs = require('fs')

module.exports = {
  publicPath: "/",
	devServer: {
		https: {
			key: fs.readFileSync('./certs/example.com+5-key.pem'),
			cert: fs.readFileSync('./certs/example.com+5.pem'),
		}
	}
}
