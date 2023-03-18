lint:
	npx eslint --fix .
gendiff:
	node bin/gendiff.js
test:
	npx jest --watchAll
