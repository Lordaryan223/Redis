# Redis Projects

A collection of small projects for learning Redis with Node.js. Each numbered project is self-contained and has its own `package.json`.

## Projects

- `01-no-setup`
- `02-local-setup`
- `03-site-banner`
- `04-redis-otp-ttl`
- `05-json-hash-api`
- `06-email-queue-redis`
- `07-order-confirmation-job-bullmq`
- `08-pub-sub`
- `09-live-leaderboard-redis`

## Run a project

From a project folder, install its dependencies and start its development script:

```sh
npm install
npm run dev
```

The root `docker-compose.yml` provides local Redis and MongoDB services when a project needs them:

```sh
docker compose up -d
```
