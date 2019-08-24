.EXPORT_ALL_VARIABLES:
SHELL = /bin/bash
ICONS = $(notdir $(wildcard ico/*.ico))

all: prep $(ICONS) cleanup aliases css

$(ICONS):
	convert "ico/$(@)" -alpha on -background transparent -set filename:sz '%z-%w' "png/$(shell grep -P '^$(@:%.ico=%)\s+' mapping.txt | head -n1 | scut -f 2)-%[filename:sz].png"

prep:
	rm png/*.png

cleanup:
	rm png/-*.png

ALIASLIST = $(shell grep -P '^$(@:%.ico=%)\s+' mapping.txt | head -n1 | scut -f 2)

aliases:
	@cd png && cat ../aliases.txt | while read b rest; do \
		for base in $${b}*.png; do \
			for dest in $${rest//,/ }; do \
				cp "$${base}" "$${base/$${b}/$${dest}}"; \
			done; \
		done; \
	done

PNGS    = $(notdir $(wildcard png/*.png))
res     = $(lastword $(subst -, ,$(@:%.png=%)))
base    = $(subst -$(res),bit,$(@:%.png=%))
iconame = $(subst -1bit,,$(subst -4bit,,$(subst -8bit,,$(base))))

$(PNGS):
	@echo ".ico-$(res).ico-$(base) { background-image: url('/assets/images/icons/png/$(@)'); }"
	$(eval ICONS_$(res) += $(iconame))

css: $(PNGS)
	@echo "$(ICONS_16)" | grep -Po '[^\s]+' | uniq | while read line; do \
		echo ".ico-16.ico-$${line} { background-image: url('/assets/images/icons/png/$${line}-8-16.png'), url('/assets/images/icons/png/$${line}-4-16.png'), url('/assets/images/icons/png/$${line}-1-16.png'); }"; \
	done

	@echo "$(ICONS_32)" | grep -Po '[^\s]+' | uniq | while read line; do \
		echo ".ico-32.ico-$${line} { background-image: url('/assets/images/icons/png/$${line}-8-32.png'), url('/assets/images/icons/png/$${line}-4-32.png'), url('/assets/images/icons/png/$${line}-1-32.png'); }"; \
	done

	@echo "$(ICONS_48)" | grep -Po '[^\s]+' | uniq | while read line; do \
		echo ".ico-48.ico-$${line} { background-image: url('/assets/images/icons/png/$${line}-8-48.png'), url('/assets/images/icons/png/$${line}-4-48.png'), url('/assets/images/icons/png/$${line}-1-48.png'); }"; \
	done

.PHONY: all css $(ICONS) $(PNGS)