<script lang="ts">
	import { registerUser } from '$lib/remote/auth.remote';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { UserPlus, AlertCircle } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	let error = $state(page.url.searchParams.get('error'));
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Create an account</Card.Title>
			<Card.Description>Sign up to start improving your grammar</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...registerUser}>
				<FieldGroup>
					{#if error}
						<div
							class="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
							role="alert"
						>
							<AlertCircle class="size-4 shrink-0" />
							<span>{error}</span>
						</div>
					{/if}
					<Field>
						<FieldLabel for="register-name">Full Name</FieldLabel>
						<Input {...registerUser.fields.name.as('text')} placeholder="Alex Johnson" />
					</Field>
					<Field>
						<FieldLabel for="register-email">Email</FieldLabel>
						<Input {...registerUser.fields.email.as('email')} placeholder="alex@example.com" />
					</Field>
					<Field>
						<FieldLabel for="register-password">Password</FieldLabel>
						<Input {...registerUser.fields.password.as('password')} />
					</Field>
					<Field>
						<Button type="submit" class="w-full gap-2">
							<UserPlus class="size-4" />
							Create account
						</Button>
						<FieldDescription class="text-center">
							Already have an account? <a href="/login" class="underline-offset-4 hover:underline"
								>Log in</a
							>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		By creating an account, you agree to our
		<a href="/terms" class="underline-offset-4 hover:underline">Terms of Service</a>
		and <a href="/privacy" class="underline-offset-4 hover:underline">Privacy Policy</a>.
	</FieldDescription>
</div>
