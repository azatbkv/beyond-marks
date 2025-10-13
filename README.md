## Using the project

Clone this repository using `git` and `cd` into the directory:

```sh
git clone https://github.com/azatbkv/beyond-marks

cd beyond-marks
```

Install all the dependencies using `pnpm`:
```sh
pnpm install
```

Now, you need to create a D1 database using the Wrangler CLI:
```sh
pnpm wrangler d1 create <YOUR_DATABASE_NAME>
```

Replace <YOUR_DATABASE_NAME> with the desired name for your database. After running this command, Cloudflare will output the database_name and database_id.

Next, you need to add the D1 database configuration to your wrangler.jsonc file. This allows your Worker to access the database.
```jsonc
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "<YOUR_DATABASE_NAME>",
      "database_id": "<YOUR_DATABASE_ID>",
      "migrations_dir": "./src/lib/server/db/migrations"
    }
  ]
```

Apply existing migrations to your database using a `pnpm` command:
```sh
pnpm migrate:prod
```

## Developing

To run the development server, you need to apply migrations to the `local.db` using a `pnpm` command:
```sh
pnpm migrate:local
```

Once you did this, you can start a development server:

```sh
pnpm dev
```

## Building

To deploy a production version of your app to Cloudfare Workers:

```sh
pnpm run deploy
```
