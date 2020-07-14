.PHONY: run
.EXPORT_ALL_VARIABLES:

GO111MODULE ?= on
CONTAINER   ?= ghetzel/aboveaveragefriendships.com:latest

all: assets run

css:
	truncate -s0 src/assets/_win9x_sprites.scss
	truncate -s0 src/assets/_win9x_icons.scss
	cd src/assets/images/sprites && make --silent css > ../../_win9x_sprites.scss
	cd src/assets/images/icons && make --silent css > ../../_win9x_icons.scss

compress:
	cd src/assets/images/people && make

assets: css compress

run:
	diecast -L debug -a :28419

pass:
	htpasswd -nBC 10 $(USER)

docker:
	docker build -t $(CONTAINER) .
	docker push $(CONTAINER)