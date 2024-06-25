# Biedronka_shakeomat


### Opis projektu
W odpowiedzi na rosnącą konkurencję na rynku detalicznym, projekt "Biedronka_shakeomat" ma na celu innowacyjne zwiększenie sprzedaży w sieci sklepów Biedronka. Aplikacja webowa umożliwia klientom wylosowanie unikalnych promocji na produkty dostępne w sklepie. Funkcjonalność ta nie tylko przyciąga nowych klientów, ale także zachęca do częstszych wizyt w sklepie. Aplikacja oferuje także możliwość zarządzania asortymentem produktów przez pracowników - dodawanie nowych, edycję istniejących oraz usuwanie nieaktualnych pozycji.


## Opis architektury
Aplikacja składa się z 5 mikroserwisów:
- frontend - aplikacja napisana w Next.js
- backend - aplikacja napisana przy użyciu Express.js
- mongodb - baza danych
- mqtt - serwer mqtt
- keycloak - serwer autoryzacji


## Uruchomienie projektu

1. Pobierz repozytorium
2. Zainstaluj zależności
3. ./start.sh
4. Otwórz przeglądarkę i wpisz localhost:3000


### wymagane porty:
- 8000
- 1883
- 27017
- 3000
- 5000


### dostępnych jest 2 użytkowników:
- login: admin, hasło: admin
- login: wiktor, hasło: wiktor

admin ma dostęp do usuwania, edytowania i dodawania produktów