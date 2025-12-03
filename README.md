## Using the project

Clone this repository using `git` and `cd` into the directory:

```sh
git clone https://github.com/azatbkv/beyond-marks

cd beyond-marks
```

To use this project you need to install `pnpm`:
```sh 
npm install -g pnpm
```

Install all the dependencies using `pnpm`:
```sh
pnpm install
```

Generate a `BETTER_AUTH_SECRET`:
```sh 
openssl rand -base64 32
```

You need to add the following secret keys to Cloudflare Workers Secrets using `pnpm dlx wrangler secret put <KEY_NAME>`:
```sh
pnpm dlx wrangler secret put GOOGLE_CLIENT_ID
pnpm dlx wrangler secret put GOOGLE_CLIENT_SECRET
pnpm dlx wrangler secret put GITHUB_CLIENT_ID
pnpm dlx wrangler secret put GITHUB_CLIENT_SECRET
pnpm dlx wrangler secret put BETTER_AUTH_SECRET
pnpm dlx wrangler secret put ADMIN_USER_ID # this is done later after logging as the admin
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

Finally, deploy a production version of your app to Cloudfare Workers:

```sh
pnpm run deploy
```

## Developing
To deploy locally, you need to add the following environment variables to your `.env` file:
```
GOOGLE_CLIENT_ID="<YOUR_ID>"
GOOGLE_CLIENT_SECRET="<YOUR_SECRET>"
GITHUB_CLIENT_ID="<YOUR_ID>"
GITHUB_CLIENT_SECRET="<YOUR_SECRET>"
BETTER_AUTH_SECRET="<YOUR_SECRET"
LOCAL_DB=file:local.db
ADMIN_USER_ID="<YOUR_ID>"
```

To run the development server, you need to apply migrations to the `local.db` using a `pnpm` command:
```sh
pnpm migrate:local
```

Once you did this, you can start a development server:

```sh
pnpm dev
```
