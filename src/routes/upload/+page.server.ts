import { dev } from "$app/environment";
import { env } from '$env/dynamic/private';
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ request}) => {
		const formData = await request.formData();
		const password = formData.get('password');
		let secret;
		if (dev) {
			secret = env.UPLOAD_SECRET_DEV;
		} else {
			secret = env.UPLOAD_SECRET;
		}
		if (!secret) throw new Error("No upload secret");
		if (password as string !== secret) return { success: false }; 
		const subjectName = formData.get('subject');
		const olympiadName = formData.get('olympiad');
		const yearDate = formData.get('year');
		const file = formData.get('file');
	}
}