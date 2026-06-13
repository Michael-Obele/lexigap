<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { User, Shield, SlidersHorizontal, Sun, Moon, Bell, Globe } from '@lucide/svelte';

	let displayName = $state('Alex Johnson');
	let bio = $state('Learning English grammar for professional development.');
	let emailNotifications = $state(true);
	let weeklyReport = $state(true);
	let newLessonNotif = $state(false);
	let darkMode = $state(true);
	let difficulty = $state(3);
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!-- Page Header -->
			<div class="px-4 lg:px-6">
				<h1 class="text-2xl font-semibold text-foreground">Settings</h1>
				<p class="text-muted-foreground">Manage your profile and preferences.</p>
			</div>

			<Separator class="mx-auto max-w-5xl" />

			<!-- Tabs -->
			<div class="px-4 lg:px-6">
				<Tabs.Root value="profile" class="w-full max-w-3xl">
					<Tabs.List class="mb-6">
						<Tabs.Trigger value="profile" class="gap-2">
							<User class="size-4" />
							Profile
						</Tabs.Trigger>
						<Tabs.Trigger value="account" class="gap-2">
							<Shield class="size-4" />
							Account
						</Tabs.Trigger>
						<Tabs.Trigger value="preferences" class="gap-2">
							<SlidersHorizontal class="size-4" />
							Preferences
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Profile Tab -->
					<Tabs.Content value="profile">
						<Card.Root class="rounded-xl border border-border/50 p-6">
							<!-- Avatar Section -->
							<div class="mb-6 flex items-center gap-4">
								<Avatar class="size-16">
									<AvatarImage src="" alt="Alex Johnson" />
									<AvatarFallback class="bg-primary text-primary-foreground text-lg font-semibold">
										AJ
									</AvatarFallback>
								</Avatar>
								<div>
									<p class="text-lg font-semibold">{displayName}</p>
									<p class="text-sm text-muted-foreground">alex@example.com</p>
									<Button variant="outline" size="sm" class="mt-2">Change Photo</Button>
								</div>
							</div>

							<Separator class="mb-6" />

							<!-- Form Fields -->
							<FieldGroup>
								<Field>
									<FieldLabel for="display-name">Display Name</FieldLabel>
									<Input id="display-name" bind:value={displayName} />
								</Field>
								<Field>
									<FieldLabel for="settings-email">Email</FieldLabel>
									<Input id="settings-email" type="email" value="alex@example.com" disabled />
									<FieldDescription
										>Email is managed through your authentication provider.</FieldDescription
									>
								</Field>
								<Field>
									<FieldLabel for="bio">Bio</FieldLabel>
									<Textarea id="bio" bind:value={bio} rows={3} maxlength={200} />
									<FieldDescription class="text-right">{bio.length}/200</FieldDescription>
								</Field>
							</FieldGroup>

							<div class="mt-6">
								<Button>Save Changes</Button>
							</div>
						</Card.Root>
					</Tabs.Content>

					<!-- Account Tab -->
					<Tabs.Content value="account">
						<div class="space-y-6">
							<!-- Change Password -->
							<Card.Root class="rounded-xl border border-border/50 p-6">
								<h3 class="mb-4 text-lg font-semibold">Change Password</h3>
								<FieldGroup>
									<Field>
										<FieldLabel for="current-password">Current Password</FieldLabel>
										<Input id="current-password" type="password" />
									</Field>
									<Field>
										<FieldLabel for="new-password">New Password</FieldLabel>
										<Input id="new-password" type="password" />
									</Field>
									<Field>
										<FieldLabel for="confirm-password">Confirm Password</FieldLabel>
										<Input id="confirm-password" type="password" />
									</Field>
								</FieldGroup>
								<div class="mt-6">
									<Button>Update Password</Button>
								</div>
							</Card.Root>

							<!-- Danger Zone -->
							<Card.Root class="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
								<h3 class="mb-2 text-lg font-semibold text-destructive">Danger Zone</h3>
								<p class="mb-4 text-sm text-muted-foreground">
									Permanently delete your account and all associated data. This action cannot be
									undone.
								</p>
								<Button variant="destructive">Delete Account</Button>
							</Card.Root>
						</div>
					</Tabs.Content>

					<!-- Preferences Tab -->
					<Tabs.Content value="preferences">
						<div class="space-y-6">
							<!-- Theme -->
							<Card.Root class="rounded-xl border border-border/50 p-6">
								<h3 class="mb-4 text-lg font-semibold">Appearance</h3>
								<div class="flex gap-4">
									<Button
										variant={!darkMode ? 'default' : 'outline'}
										class="flex-1 gap-2"
										onclick={() => (darkMode = false)}
									>
										<Sun class="size-4" />
										Light
									</Button>
									<Button
										variant={darkMode ? 'default' : 'outline'}
										class="flex-1 gap-2"
										onclick={() => (darkMode = true)}
									>
										<Moon class="size-4" />
										Dark
									</Button>
								</div>
							</Card.Root>

							<!-- Notifications -->
							<Card.Root class="rounded-xl border border-border/50 p-6">
								<div class="mb-4 flex items-center gap-2">
									<Bell class="size-5 text-muted-foreground" />
									<h3 class="text-lg font-semibold">Notifications</h3>
								</div>
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium">Daily practice reminder</p>
											<p class="text-xs text-muted-foreground">Get notified to practice each day</p>
										</div>
										<Switch checked={emailNotifications} />
									</div>
									<Separator />
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium">New lesson available</p>
											<p class="text-xs text-muted-foreground">When a new lesson is unlocked</p>
										</div>
										<Switch checked={newLessonNotif} />
									</div>
									<Separator />
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium">Weekly progress report</p>
											<p class="text-xs text-muted-foreground">Summary of your weekly activity</p>
										</div>
										<Switch checked={weeklyReport} />
									</div>
								</div>
							</Card.Root>

							<!-- Language & Difficulty -->
							<Card.Root class="rounded-xl border border-border/50 p-6">
								<div class="mb-4 flex items-center gap-2">
									<Globe class="size-5 text-muted-foreground" />
									<h3 class="text-lg font-semibold">Language & Difficulty</h3>
								</div>
								<FieldGroup>
									<Field>
										<FieldLabel for="language">App Language</FieldLabel>
										<select
											id="language"
											class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											<option value="en">English</option>
											<option value="es">Spanish</option>
											<option value="fr">French</option>
											<option value="de">German</option>
										</select>
									</Field>
								</FieldGroup>
								<div class="mt-4">
									<FieldLabel class="mb-2 block">Content Difficulty</FieldLabel>
									<div class="flex items-center gap-4">
										<input
											type="range"
											min="1"
											max="5"
											step="1"
											bind:value={difficulty}
											class="flex-1 accent-primary"
										/>
										<span class="text-sm font-medium tabular-nums">{difficulty}/5</span>
									</div>
									<div class="mt-1 flex justify-between text-xs text-muted-foreground">
										<span>Basic</span>
										<span>Intermediate</span>
										<span>Advanced</span>
									</div>
								</div>
							</Card.Root>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</div>
