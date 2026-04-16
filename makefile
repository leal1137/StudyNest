#Kör tester
test:
	npm test

backend:
	node server/server.js

interact:
	$(MAKE) -C client frontend

run:
	$(MAKE) backend &
	$(MAKE) interact
	

#Skapa dokumentation
docs:
	npm run docs

#Tar bort docs mappen
clean:
	rm -rf docs/