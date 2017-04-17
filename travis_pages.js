var exec = require('child_process').exec;
const fs = require('fs-extra');
var colors = require('colors');
var path = require('path');
var prompt = require('./support/prompt')

require('./config/config')

var sPrefix = "tP"


	/**
	*  Step 1: 	Check if travis installed.
	*			Attempt to install of not installed before
	*  Step 2:  Create .travis.yml file
	*
	*  Step 3: Create SSH keys and update .travis.yml file
	*/



module.exports = function(sender, options){

	sPrefix = sender == null ? sPrefix : sender;

	exec('travis --version', (error, stdout, stderr) => {
		
		if( error !== null )
		{
			process.stdout.write(colors.rainbow(sPrefix + " => ") + "Installing Travis First!! \n");
			var travis_install_cmd = 'gem install travis'
			
			//using sudo if OS is not windows
			if(process.platform != "win32")
				travis_install_cmd = 'sudo ' + travis_install_cmd; 
				
			console.warn( ("===>  " + travis_install_cmd).warn);
			
			exec(travis_install_cmd, (error, stdout, stderr) => {
				if( error != null){
					console.error( colors.rainbow(sPrefix + " => ") + "oh BBoy! There is some issue on installing. Try installing travis gem first and then retry. ")
					process.exit();
				}
				travis_login(options);
			});
		}
		else
		{
			process.stdout.write( colors.rainbow(sPrefix + " => ") + "Travis is already installed 😬 puri! \n" );
			travis_login(options);
		}
	})
}

var travis_login = (options) => {

	exec('travis whoami', (err, stdout, stderr) => {

		if( err != null )
			console.error( "Please login into travis first. Run \n\t ".error + "travis login".info + "\n then continue".error );
		else
			continue_install(options);
	});

}

var continue_install = (options) => {

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

				fs.copySync(__dirname + '/scripts/deploy.sh', process.cwd() +'/deploy.sh');

				prompt.askRepo( (answer) => {
					// console.log( answer );
					// travis.add_env_var('GIT_REPO', answer);
					if( options.after_success == undefined )
						prompt.askAfterSuccess( (answer)=> {
							// travis.add_after_success( answer );
							console.log( answer )
							process.stdout.write("\n Done! Enjoy! \n- Team Statiko 🎉 ");
						});
					else
						console.log('@TODO')
						// travis.add_after_success( options.after_success );
				});

			}
		});

	})
	


}
