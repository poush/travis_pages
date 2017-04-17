const inquirer = require('inquirer');
const exec = require('child_process').exec;
const prompt = inquirer.createPromptModule();


module.exports = {
	askRepo : ( callback ) => {
		exec( 'git config --get remote.origin.url' ,( err, stdout, stderr ) => {
			
			var schema = [
				{
					type: 'input',
					name: 'repo',
					message: 'Github Repo',
					default: stdout.split("//")[1].replace("\n","")
				}
			]
		
			prompt(schema).then( (answers) => {
				callback( answers.repo );
			});
		
		})
	},

	askAfterSuccess: (callback) => {

		var schema = [
			{
				type: 'input',
				name: 'after_success',
				message: 'After Success( add multiple by comma separated )',
				default: "gh-deploy.sh"
			}
		]
	
		prompt(schema).then( (answers) => {
			callback( answers.after_success );
		});
	}
}