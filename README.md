nodemon run node js:
	$ DEBUG=projectx:* npm run devstart

If you have installed mongodb through homebrew then you can simply start mongodb through:
	$ brew services start mongodb

Then access the shell by:
	$ mongo

You can shut down your db by:
	$ brew services stop mongodb

You can restart your db by:
	$ brew services restart mongodb

For more options:
	$ brew info mongodb