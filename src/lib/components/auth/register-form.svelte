<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator,
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Create an account</Card.Title>
			<Card.Description>Sign up to start improving your grammar</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<FieldGroup>
					<Field>
						<FieldLabel for="register-name">Full Name</FieldLabel>
						<Input id="register-name" type="text" placeholder="Alex Johnson" required />
					</Field>
					<Field>
						<FieldLabel for="register-email">Email</FieldLabel>
						<Input id="register-email" type="email" placeholder="alex@example.com" required />
					</Field>
					<Field>
						<FieldLabel for="register-password">Password</FieldLabel>
						<Input id="register-password" type="password" required />
					</Field>
					<Field>
						<Button type="submit">Create account</Button>
						<FieldDescription class="text-center">
							Already have an account? <a href="/login">Log in</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		By creating an account, you agree to our <a href="/terms">Terms of Service</a>
		and <a href="/privacy">Privacy Policy</a>.
	</FieldDescription>
</div>
