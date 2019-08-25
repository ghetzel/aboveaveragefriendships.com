INPUTS += $(wildcard *.png)

.PHONY: $(INPUTS)

all: $(INPUTS)
	ln -sf m-5.gif todd.gif
	ln -sf m-10.gif randy.gif

$(INPUTS):
	convert "$(@)" -resize 160x -dither FloydSteinberg -colors 24 "$(@:%.png=%.gif)"