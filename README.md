# CreativeHubClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

#docker build command

docker build -t creative-hub-client -f Dockerfile .


#docker run command

docker run --rm -it -p 4200:4200 creative-client


#kubernetes command

minikube start

minikube ip 

docker build -t creative-hub-client -f Dockerfile path/CreativeHubClient

docker tag creative-hub-client ghcr.io/creative-hub-taass/creative-hub-client

docker push ghcr.io/creative-hub-taass/creative-hub-client

kubectl apply -f  path/CreativeHubClient/Orchestration

#client web interface

https://{minikube ip}.nip.io:30006

#start chrome 

google-chrome --disable-web-security --disable-gpu --user-data-dir="/tmp/MiCarpeta" -ignore-certificate-errors
