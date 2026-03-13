FROM alpine:latest

COPY dist/*.ajs /archi-scripts/

CMD ["/bin/sh"]
