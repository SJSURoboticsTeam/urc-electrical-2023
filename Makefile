.PHONY := clean all
BUILD := CommunicationPower/Documentation.md

all: $(addsuffix .html, $(addprefix build/, $(basename $(BUILD))))


build/%.html: %.md build/build.js
	mkdir $(@D)
	node build/build.js $< $@

build/build.js: build.ts package.json tsconfig.json package-lock.json
	npm install
	npm run build

clean:
	rm -rdf build