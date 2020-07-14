FROM ghetzel/diecast:1.18.5
MAINTAINER Gary Hetzel <its@gary.cool>

ADD diecast.yml /config/diecast.yml
ADD src /webroot
RUN sed -i 's|root: src|root: /webroot|' /config/diecast.yml

EXPOSE 28419
ENV LOGLEVEL debug
ENV DIECAST_CONFIG /config/diecast.yml
ENV DIECAST_ADDRESS :28419

WORKDIR "/webroot"
CMD ["/init"]
