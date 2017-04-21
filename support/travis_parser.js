var yaml = require('js-yaml');
var fs  = require('fs-extra');
 

var mod = function( ){

	// Private variables
	var data = '';
	var file = '';


	this.save = function() {
		var yaml_dump = yaml.safeDump( this.data );
		fs.outputFileSync( this.file, yaml_dump);
	}

	this.add_after_success = ( value ) => {

		// @WARN: We are currently assuming that we will have array here
		// console.log(this.data);
		var after_success = this.data.after_success;
		after_success = after_success == null || after_success == undefined ? [] : after_success;

		after_success.push(value);
		this.data.after_success = after_success;
		// console.log( this.data )
		this.save();
		this.load();
	}


	//Constructor
	this.load = ( file ) => {

		this.file = process.cwd() + ( file == null ? '/.travis.yml' : file );

		// Get document, or throw exception on error 
		try {
			this.data = yaml.safeLoad( fs.readFileSync( this.file ) );
			// console.log(this.data);

		} catch (e) {
			console.log(e);

		}

	}

}

module.exports = mod;