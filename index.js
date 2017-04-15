#!/usr/bin/env node

travis_pages = require('./travis_pages')

if( process.argv[2] == 'install')
	travis_pages();
