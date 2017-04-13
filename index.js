#!/usr/bin/env node

var exec = require('child_process').exec;
var prompt = require('prompt');
const fs = require('fs-extra')
var path = require('path')


prompt.message = ""
var pr = process.argv[2];

if( pr == 'install' )
{
	exec(__dirname + '/scripts/install.sh '+__dirname, function(error, stdout, stderr){
		if( error == null )
			process.stdout.write(stdout);
		else
			console.log(error)
		var schema = {
			properties: {
				key: {
					description: "Enter your Github token",
					required: true,
					message: "Required!"
				}
			}
		}
		prompt.start();

		prompt.get(schema, function(err, result){
			if( fs.existsSync(process.cwd() + '/.travis.yml') )
			{
				exec(__dirname + "/scripts/generate_key.sh " + result.key, (error, stdout, stderr) => {
					// need to check for error here below
					if( true ){
						process.stdout.write(stdout);
						fs.createReadStream(__dirname + '/scripts/deploy.sh').pipe(fs.createWriteStream(process.cwd() +'/statiko-deploy.sh'));
						process.stdout.write("\nMake sure to add your github repository url( without http or https )\ninto your 'env' section of .travis.yml. For example: \n========\n");
						process.stdout.write("GIT_REPO=\"github.com/poush/statiko\"\n========\n");
						process.stdout.write("\n Done! Enjoy! \n- Team Statiko 🎉 ");
					}
				});
			}
		})
	})
}
else if( pr == 'make'){

	exec('git diff HEAD HEAD~1 --name-only', function(err, stdout, stderr) {
		if(err)
			throw err
		files = stdout.split("\n");
		filesToSend = []
		files.forEach( (ele) => {
			if(
				ele != "README.md" &&
				ele != "index.html" &&
				ele != ".gitignore" &&
				ele != "package.json" &&
				ele != "bower.json" &&
				ele != ""
			){
				filesToSend.push( ele );
			}
		});
		buildAPI( filesToSend );
	})

}


function buildAPI( files ){

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	string = {
		updated_at: mm+'/'+dd+'/'+yyyy, 
		data: "{{data}}"
	};

	files.forEach(function(ele){
		fs.readFile(process.cwd() + '/' + ele, function read(err, data) {
	    	if (err) {
	        	return ;
	    	}
	    	string.data = data.toString();
	    	fs.outputJsonSync(process.cwd() + '/api/' + ele + '.json', string);
		});
	})
}