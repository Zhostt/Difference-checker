install: install-deps
	# npx simple-git-hooks
install-deps:
	npm ci
lint:
	npx eslint --fix .
gendiff:
	node bin/gendiff.js
test:
	npx jest --watchAll
test-coverage:
	npm test -- --coverage --coverageProvider=v8
