# Head coach
Mindtastic motivator service

## Local development

We provide a `Dockerfile.dev` for building a local development container and a `docker-compose.yml` for bringing up the service and a postgresql database for local development. For a quickstart just run

```bash
docker compose up
```

We are using ESLint for enforcing code style and Jest for testing. Please note that commits not compliant with the code style of having failed test will be rejected by the CI/CD pipeline.

```bash
npm install

npx eslint .    # Run linter
npm run test    # Run jest tests
```

## Database schema

You find the database schema in `docs/`
