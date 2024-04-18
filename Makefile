shell := /bin/bash
build:
	rm -rf .next
	cp .env.prod .env
	npm run build

dev:
	rm -rf .next
	cp .env.dev .env
	NEXT_PUBLIC_HOST=http://192.168.3.124:9000 npx next dev -p 9000

start:
	npm run start

bd: build
	sudo docker build -t mh.com:8890/test/vshop:v1.0 .
	sudo docker push mh.com:8890/test/vshop:v1.0

rd: # restart docker
	sudo docker stop vshop_v1
	sudo docker rm vshop_v1
	sudo docker run --restart always -d --name vshop_v1 --add-host mongo1:192.168.3.124 --add-host mongo2:192.168.3.124 --add-host mongo3:192.168.3.124 -p 9627:3000 -v $(HOME)/posts:/app/posts mh.com:8890/test/vshop:v1.0

sd:
	sudo docker run --restart always -d --name vshop_v1 --add-host mongo1:192.168.3.124 --add-host mongo2:192.168.3.124 --add-host mongo3:192.168.3.124 -p 9627:3000 mh.com:8890/test/vshop:v1.0

api:
	cd src/proto && /bin/bash typescript.bp
