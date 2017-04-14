#!/usr/bin/env node

var exec = require('child_process').exec;
var prompt = require('prompt');
const fs = require('fs-extra');
var path = require('path');
var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

prompt.message = ""
var pr = process.argv[2];

if( pr == 'install' )
{
	exec('which travis', function(error, stdout, stderr){
		
		if( error != null )
		{
			process.stdout.write(colors.rainbow("sK => ") + "Installing Travis First!! \n");
			
			console.log("===>  sudo gem install travis".warn);

			exec('sudo gem install travis', function(error, stdout, stderr){
				install_token();
			});
		}
		else
		{
			process.stdout.write( colors.rainbow("sK => ") + "Travis is already installed 😬 \n" + "sK => ".silly + "Try avoiding doing my work 😒 puri!\n" );
			install_token();
		}
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

function install_token() {
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

			if(  !fs.existsSync(process.cwd() + '/.travis.yml') ){
				fs.copySync( __dirname + "/.example.travis.yml", process.cwd() + '/.travis.yml');
				process.stdout.write(colors.rainbow("sK => ") + ".travis.yml Created! \n");				
			}
			else{
					console.log("\n" + colors.rainbow("sK => ") + ".travis.yml is already created! abort creating file!!");
					console.log("Add below to your .travis.yml file\n========".warn);
					console.log("after_success: \"./scripts/deploy.sh\"".info +"\n========\n".warn);
			}
			if( fs.existsSync( process.cwd() + '/.travis.yml' ) )
			{
				exec( "travis encrypt \"GH_TOKEN="+ result.key +"\" --add", (error, stdout, stderr) => {
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
}