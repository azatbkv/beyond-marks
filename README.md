## Using the project

Fork this repository and clone it using `git`:

```sh
git clone https://github.com/azatkbv/beyond-marks

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
```

Now, you need to create a D1 database using the Wrangler CLI:
```sh
pnpm wrangler d1 create marks-db
```

After running this command, Cloudflare will output the database_name and database_id.

Next, you need to add the D1 database configuration to your wrangler.jsonc file. This allows your Worker to access the database.
```jsonc
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "marks-db",
      "database_id": "<YOUR_DATABASE_ID>",
      "migrations_dir": "./src/lib/server/db/migrations"
    }
  ]
```

Apply existing migrations to your database using a `pnpm` command:
```sh
pnpm migrate:prod
```

This project uses GitHub Actions to automatically sync the olympiads/ directory with your remote D1 database. To enable this, you need to provide Cloudflare credentials to GitHub.
First, obtain your Cloudflare Account ID from the Cloudflare Dashboard (Workers & Pages > righthand sidebar)
Next, generate a Custom API Token in My Profile > API Tokens with the following permissions:
Account > D1 > Edit

You need to add the following repository secrets to your GitHub Repository (Settings > Secrets and variables > Actions):
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN


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
ADMIN_USER_ID="<YOUR_USER_ID>"
```

To run the development server, you need to apply migrations to the `local.db` using a `pnpm` command:
```sh
pnpm migrate:local
```

Once you did this, you can start a development server:

```sh
pnpm dev
```
