.PHONY: run
.EXPORT_ALL_VARIABLES:

GO111MODULE ?= on

all: run

run:
	diecast -L debug -a :28419

pass:
	htpasswd -nBC 10 $(USER)