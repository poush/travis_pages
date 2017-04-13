var exec = require('child_process').exec;
var prompt = require('prompt');
var fs = require('fs')


prompt.message = ""
var pr = process.argv[2];

if( pr == 'install' )
{
	exec('./scripts/install.sh', function(error, stdout, stderr){
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
			if( fs.existsSync('.travis.yml') )
			{
				exec("travis encrypt \"GH_TOKEN=" + result.key + " --add", (error, stdout, stderr) => {
					if( error !== null ){
						process.stdout.write(stdout);
						fs.createReadStream('.travis.yml').pipe(fs.createWriteStream('../travis.yml'));

						process.stdout.write("\nMake sure to add your github repository url( without http or https )\ninto your 'env' section of .travis.yml. For example: \n========\n");
						process.stdout.write("GIT_REPO=\"github.com/poush/statiko\"\n========\n");
						process.stdout.write("\n Done! Enjoy! \n- Team Statiko 🎉 ");
					}
				});
			}
		})
	})
}