import { redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { auth } from '$lib/auth';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

/**
 * Login form remote.
 * Spread on a `<form>` element: `<form {...loginUser}>`
 */
export const loginUser = form(
	v.object({
		email: v.pipe(v.string(), v.email('Please enter a valid email address')),
		password: v.pipe(v.string(), v.minLength(1, 'Password is required'))
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers
			});
			redirect(303, '/dashboard');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to sign in';
			error(400, `Login failed: ${message}`);
		}
	}
);

/**
 * Register form remote.
 * Spread on a `<form>` element: `<form {...registerUser}>`
 */
export const registerUser = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
		email: v.pipe(v.string(), v.email('Please enter a valid email address')),
		password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters'))
	}),
	async ({ name, email, password }) => {
		const event = getRequestEvent();

		try {
			await auth.api.signUpEmail({
				body: { name, email, password },
				headers: event.request.headers
			});
			redirect(303, '/dashboard');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create account';
			redirect(303, `/register?error=${encodeURIComponent(message)}`);
		}
	}
);
