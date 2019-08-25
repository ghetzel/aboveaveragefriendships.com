.PHONY: run
.EXPORT_ALL_VARIABLES:

GO111MODULE ?= on

all: assets run

css:
	truncate -s0 src/assets/_win9x_sprites.scss
	truncate -s0 src/assets/_win9x_icons.scss
	cd src/assets/images/sprites && make --silent css > ../../_win9x_sprites.scss
	cd src/assets/images/icons && make --silent css > ../../_win9x_icons.scss

assets: css

run:
	diecast -L debug -a :28419

pass:
	htpasswd -nBC 10 $(USER)