.PHONY: clean all
BUILD := CommunicationPower/Documentation.md
TARGETS := $(addsuffix .html, $(addprefix build/, $(basename $(BUILD))))
DEPS := $(addsuffix .d, $(TARGETS))

all: $(TARGETS)

build/%.html.d : %.md build/build.js
	mkdir -p $(@D)
	node build/build.js $< $@ -M

build/%.html : %.md build/build.js
	node build/build.js $< $@

build/build.js: build.ts tsconfig.json package-lock.json
	npm run build

package-lock.json: package.json
	npm install

clean:
	rm -rdf build

include $(DEPS)