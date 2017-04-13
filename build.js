var fs = require('fs')
var key = ""

function() {

}


function install() {

	fs.readFile('example.travis.yml', function(err, contents){
		contents.replace('{{KEY}}', key);
	})
}

function deploy() {

	
}