# MlSearch - Back
## Proyecto desarrollado en node con express
Node version v12.12.0
Npm version v6.11.3

### Setup
Clonar repositorio e installar módulos
#### npm install

### Crear archivo .env en la raiz del proyecto con la siguiente información:
#### ML_API_SERVICE_URL=https://api.mercadolibre.com
#### PORT=3200

Iniciar el servidor con
#### npm run dev

### Para correr pruebas
#### npm run test

## Si tienes istalado Docker
1. clonar repositorio del front en angular, este contiene el docker-compose.yml
#### https://github.com/wrubio/ml-search
2. inciar docker compose:
#### docker-compose up --build

### El proyecto front depende de esta appi para realizar las búsquedas de los items
