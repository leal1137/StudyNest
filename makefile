#Kör tester
test:
	npm test

interact:
	$(MAKE) -C client start

#Skapa dokumentation
docs:
	npm run docs

#Tar bort docs mappen
clean:
	rm -rf docs/