<script lang="ts">
	import { loginUser } from '$lib/remote/auth.remote';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { LogIn, LoaderCircle, AlertCircle } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	let error = $state(page.url.searchParams.get('error'));
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Welcome back</Card.Title>
			<Card.Description>Sign in to your LexiGap account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...loginUser}>
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
						<FieldLabel for="email">Email</FieldLabel>
						<Input
							{...loginUser.fields.email.as('email')}
							placeholder="alex@example.com"
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password">Password</FieldLabel>
							<a href="/forgot-password" class="ms-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input {...loginUser.fields.password.as('password')} />
					</Field>
					<Field>
						<Button type="submit" class="w-full gap-2">
							<LogIn class="size-4" />
							Log in
						</Button>
						<FieldDescription class="text-center">
							Don't have an account? <a href="/register" class="underline-offset-4 hover:underline"
								>Sign up</a
							>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		By clicking continue, you agree to our <a href="/terms" class="underline-offset-4 hover:underline"
			>Terms of Service</a
		>
		and <a href="/privacy" class="underline-offset-4 hover:underline">Privacy Policy</a>.
	</FieldDescription>
</div>
