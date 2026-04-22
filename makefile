#Kör tester
test:
	npm test --prefix ./server

interact:
	$(MAKE) -C client start

run:
	npm run dev

#Skapa dokumentation
docs:
	npm run docs

#Tar bort docs mappen
clean:
	rm -rf docs/