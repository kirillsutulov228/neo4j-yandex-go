# Онтологическая модель приложения YandexGo

Программа позволяет проанализировать онтологию приложения YandexGo с помощью СУБД neo4j

## Установка и запуск

Приложение состоит из двух частей: клиентской (папка client) и серверной (папка server)

Для установки необходимых пакетов для клиентской и серверной части из обеих директорий нужно вызвать команду `npm install`

После установки пакетов из обеих директорий нужно
вызвать команду `npm start`

Серверная часть требует установки параметров среды. Загрузка параметров осуществляется через файл .env, который должен находиться в папке server.
Примером конфигурационного файла является файл example.env

Для запуска приложения необходима платформа "Node.js"
