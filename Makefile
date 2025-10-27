
all: run

buildFront:
	cd src/Frontend && npm run watch

run:
	docker compose up

build:
	docker compose build

clean:
	docker compose down

re: clean build run