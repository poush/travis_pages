var exec = require('child_process').exec;
const fs = require('fs-extra');
var prompt = require('prompt');
var colors = require('colors');
var path = require('path');

require('./config/config')


var schema = {
  properties: {
    key: {
      description: "Enter your Github SSH Key",
      required: true,
      message: "Required!"
    }
  }
}

var sPrefix = "tP"


	/**
	*  Step 1: 	Check if travis installed.
	*			Attempt to install of not installed before
	*  Step 2:  Create .travis.yml file
	*
	*  Step 3: Create SSH keys and update .travis.yml file
	*/



module.exports = function(sender){

	sPrefix = sender == null ? sPrefix : sender;

	exec('travis --version', (error, stdout, stderr) => {
			/*
			* for installing travis on windows 
			*/
		
			if( error != null )
			{
				process.stdout.write(colors.rainbow(sPrefix + " => ") + "Installing Travis First!! \n");

				console.warn("===>  gem install travis".warn);
				if(process.platform === "win32") {
						exec('gem install travis', (error, stdout, stderr) => {
								if( error != null) {
									console.error( colors.rainbow(sPrefix + " => ") + "oh BBoy! There is some issue on installing. Try installing travis ")
									process.exit();
								}

								});
				}
			
			
			/*
			* for installing travis on linux and mac 
			*/
			else {
				console.warn("===>  sudo gem install travis".warn);
				exec('sudo gem install travis', (error, stdout, stderr) => {
				if( error != null){
					console.error( colors.rainbow(sPrefix + " => ") + "oh BBoy! There is some issue on installing. Try installing travis ")
	
				}
			}

				
				travis_login();
			});
		}
		else
		{
			process.stdout.write( colors.rainbow(sPrefix + " => ") + "Travis is already installed 😬 puri! \n" );
			travis_login();
		}
	})
}

var travis_login = () => {

	exec('travis whoami', (err, stdout, stderr) => {

		if( err != null )
			console.error( "Please login into travis first. Run \n\t ".error + "travis login".info + "\n then continue".error );
		else
			continue_install();
	});

}

var continue_install = () => {

	// prompt.start();
// 
	// prompt.get(schema, (err, result) => {
		
	// Creating .travis.yml file
	if(  !fs.existsSync(process.cwd() + '/.travis.yml') ){

		fs.copySync( __dirname + "/.example.travis.yml", process.cwd() + '/.travis.yml');
		process.stdout.write(colors.rainbow( sPrefix + " => ") + ".travis.yml Created! 🍻 arcgut!\n");				

	}
	else{
			// If file already exsists
			console.log("\n" + colors.rainbow( sPrefix + " => ") + ".travis.yml is already created! abort creating new file!!");
			
			// @TODO: ADD YML parser to add this part into travis file
			// var travis = require('./support/travis_parse')
			
			// Prompt user for github_repo then add to travis_file
			// var obj = travis.obj()
			// update obj with desired changes
			// travis.update(obj);
			// travis.save() => will update travis.yml file

			console.log("Add below to your .travis.yml file\n========".warn);
			console.log("after_success: \"./scripts/deploy.sh\"".info +"\n========\n".warn);

	}
	
	// Deleting any previous SSH key file
	fs.removeSync( process.cwd() + '/.ssh.key')
	fs.removeSync( process.cwd() + '/.ssh.key.pub')
	// if( !fs.existsSync(process.cwd() + '/.ssh.key.enc') )
		fs.removeSync( process.cwd() + '/.ssh.key.enc')
	// else
	// {

	// }

	exec('ssh-keygen -t rsa -f "./.ssh.key" -P "Travis"', (error, stdout, stderr) => {
		exec('travis encrypt-file "./.ssh.key" --add', (err, stdout, stderr) => {
			fs.removeSync( process.cwd() + '/.ssh.key')
			
			var pub = fs.readFileSync( process.cwd() + '/.ssh.key.pub' );
			console.log( "\nHere below is you public ssh-key. Add this to your repository deploy keys.\n".warn
							+ "Please note that only you can not retrieve it later. Only new keys can be created\n".error)
			console.log( pub + "\n");
			
			fs.removeSync( process.cwd() + '/.ssh.key.pub')
		
			if( fs.existsSync( process.cwd() + '/.travis.yml' ) )
			{

				fs.copySync(__dirname + '/scripts/deploy.sh', process.cwd() +'/statiko-deploy.sh');

				//SEE LINE 93 for this
				process.stdout.write("\nMake sure to add your github repository url( without http or https )\ninto your 'env' section of .travis.yml. For example: \n========\n");
				process.stdout.write("GIT_REPO=\"github.com/poush/statiko\"\n========\n");
				// Must be automated

				process.stdout.write("\n Done! Enjoy! \n- Team Statiko 🎉 ");
			}
		});

	})
	


}
