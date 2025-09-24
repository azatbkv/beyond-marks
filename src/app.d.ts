import type { DrizzleClient } from '$lib/server/db';
import type { Session, User } from 'better-auth';
import type { BetterAuth } from './auth';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			db: DrizzleClient;
			auth: BetterAuth;
			session: Session;
			user: User;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
