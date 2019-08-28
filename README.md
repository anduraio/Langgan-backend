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

install dependencies:
     $ cd rent && npm install

 run the app:
     $ DEBUG=projectx:* npm start

nodemon run node js:
	 $ DEBUG=projectx:* npm run devstart

If u are running with emulator use URL as http://10.0.2.2:3000/api/ instead of localhost

Running from mobile app use PC IP address http://192.168.43.216:3000/api/

starting mongoDb on local
	$ brew services start mongodb

	> show dbs
	> use rent
	> show collections
	> db.users.find()