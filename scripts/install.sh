not_there=false

if ! which travis > /dev/null
	then
		sudo gem install travis
	else
		echo "\nsk: ====>Travis is already installed 😬 \nsk: ====>Try avoiding doing my work 😒 puri!\n"
	fi

if [ ! -e "../.travis.yml" ]
	then
		not_there=true
		travis init node --force --no-interactive --skip-enable --after-success="./scripts/deploy.sh"
		echo "\n sk: ====> .travis.yml created 🍻 arcgut!"
	else
		echo "\nsk: ====> .travis.yml is already created! abort creating file!!"
		echo "Add below to your .travis.yml file\n========";
		echo "after_success: \"./scripts/deploy.sh\"\n========\n"
	fi


read -p " sk: ==>  Enter your github token: " token

if [ $not_there == false ]
	then
		cp "../.travis.yml" "travis.yml"
	fi
	
travis encrypt "GH_TOKEN={$token}" --add
cp ".travis.yml" "../.travis.yml"


echo "\nMake sure to add your github repository url( without http or https )\ninto your 'env' section of .travis.yml. For example: \n========";
echo "GIT_REPO=\"github.com/poush/statiko\"\n========\n"

echo "\n Done! Enjoy! \n- Team Statiko 🎉"