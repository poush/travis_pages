not_there=false

if ! which travis > /dev/null
	then
		sudo gem install travis
	else
		echo "\n====>Travis is already installed 😬 \n====>Try avoiding doing my work 😒 puri!\n"
	fi

if [ ! -e "../.travis.yml" ]
	then
		not_there=true
		travis init node --force --no-interactive --skip-enable --after-success="./scripts/deploy.sh"
		echo "\n====> .travis.yml created 🍻 arcgut!"
	else
		echo "Add below to your .travis.yml file\n========";
		echo "after_success: \"./scripts/deploy.sh\"\n========\n"
	fi


read -p " ==>  Enter your github token: " token

if [ $not_there == false ]
	then
		cp "../.travis.yml" "travis.yml"
	fi
	
travis encrypt "GIT_TOKEN={$token}" --add
cp ".travis.yml" "../.travis.yml"

echo "\n Done! Enjoy! \n- Team Statiko 🎉"