.EXPORT_ALL_VARIABLES:
SHELL = /bin/bash
SPRITES = $(notdir $(wildcard *.gif))

css: $(SPRITES)

base  = $(subst .,,$(subst -normal.,.,$(subst -disabled.,.,$(subst -active.,.,$(@:%.gif=%.)))))
state = $(lastword $(subst -, ,$(@:%.gif=%)))

.PHONY: $(SPRITES)
$(SPRITES):
	@echo ".sprite$(if $(filter $(state),normal),,.sprite-state-$(state)).sprite-$(base) { background-image: url('/assets/images/sprites/$(@)'); }"
	$(if $(filter $(state),active),$(info *:hover > .sprite.sprite-$(base) { background-image: url('/assets/images/sprites/$(@)'); }),)
