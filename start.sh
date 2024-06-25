#!/bin/bash

docker build -t frontend-biedronka ./biedronka
docker build -t backend-biedronka ./baza_danych
docker build -t keycloak-biedronka ./keycloak


kubectl apply -f . --validate=false



# kubectl get pods


# kubectl delete all --all