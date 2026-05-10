<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>PlainTube</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="login-root">
	<main class="login-card">
		<header class="login-header">
			<div class="rule"></div>
			<div class="wordmark-row">
				<span class="wordmark">PlainTube</span>
				<span class="version">for YouTube</span>
			</div>
			<div class="rule"></div>
		</header>

		<section class="login-body">
			<p class="tagline">Your subscriptions.<br />Chronological order.<br />No algorithm.</p>

			<ul class="features">
				<li><span class="bullet">—</span> Every channel you follow, merged into one inbox</li>
				<li><span class="bullet">—</span> Archive videos to keep your inbox clear</li>
				<li><span class="bullet">—</span> No recommendations. No trending. No noise.</li>
			</ul>

			<button
				class="signin-btn"
				onclick={() => signIn('google', { callbackUrl: '/' })}
			>
				<svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
				</svg>
				Sign in with Google
			</button>

			<p class="privacy-note">
				Uses YouTube's official API. No data stored on our servers.
			</p>
		</section>

		<footer class="login-footer">
			<div class="rule"></div>
			<div class="footer-row">
				<a
					href="https://github.com/rzoleta/plaintube"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link"
				>GitHub</a>
				<div class="footer-right">
					<a href="/privacy" class="footer-link">Privacy</a>
					<a href="/terms" class="footer-link">Terms</a>
				</div>
			</div>
		</footer>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.login-root {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		padding: 2rem 1rem;
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
	}

	:global(.dark) .login-root {
		background-color: #111;
	}

	.login-card {
		width: 100%;
		max-width: 420px;
		background: #fff;
		border: 1px solid #e0e0e0;
		padding: 0;
		animation: fadein 0.3s ease;
	}

	:global(.dark) .login-card {
		background: #1a1a1a;
		border-color: #2a2a2a;
	}

	@keyframes fadein {
		from { opacity: 0; transform: translateY(6px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Rules ── */
	.rule {
		height: 3px;
		background-color: #0078d4;
	}

	/* ── Header ── */
	.login-header {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.wordmark-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 1rem 1.5rem 0.875rem;
		background: #fff;
	}

	:global(.dark) .wordmark-row {
		background: #1a1a1a;
	}

	.wordmark {
		font-family: 'IBM Plex Mono', monospace;
		font-weight: 600;
		font-size: 1.3rem;
		letter-spacing: -0.01em;
		color: #111;
	}

	:global(.dark) .wordmark {
		color: #f0f0f0;
	}

	.version {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		font-weight: 400;
		color: #999;
		letter-spacing: 0.02em;
	}

	/* ── Body ── */
	.login-body {
		padding: 1.75rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.tagline {
		font-size: 1.4rem;
		font-weight: 500;
		line-height: 1.45;
		color: #111;
		margin: 0;
		letter-spacing: -0.02em;
	}

	:global(.dark) .tagline {
		color: #f0f0f0;
	}

	.features {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		border-left: 2px solid #e0e0e0;
		padding-left: 0.875rem;
	}

	:global(.dark) .features {
		border-left-color: #2a2a2a;
	}

	.features li {
		font-size: 0.82rem;
		color: #555;
		display: flex;
		gap: 0.4rem;
		line-height: 1.5;
	}

	:global(.dark) .features li {
		color: #aaa;
	}

	.bullet {
		color: #0078d4;
		flex-shrink: 0;
		font-family: 'IBM Plex Mono', monospace;
	}

	/* ── Sign in button ── */
	.signin-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.625rem;
		width: 100%;
		padding: 0.7rem 1rem;
		background: #0078d4;
		color: #fff;
		border: none;
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s ease;
		letter-spacing: 0.01em;
	}

	.signin-btn:hover {
		background: #006cbe;
	}

	.signin-btn:active {
		background: #005ba1;
	}

	.google-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
		background: #fff;
		border-radius: 2px;
		padding: 1px;
	}

	/* ── Privacy note ── */
	.privacy-note {
		margin: 0;
		font-size: 0.73rem;
		color: #999;
		text-align: center;
		line-height: 1.5;
	}

	/* ── Footer ── */
	.login-footer {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.footer-row {
		padding: 0.625rem 1.5rem;
		background: #fafafa;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer-right {
		display: flex;
		gap: 1rem;
	}

	:global(.dark) .footer-row {
		background: #141414;
	}

	.footer-link {
		font-size: 0.73rem;
		color: #999;
		text-decoration: none;
		transition: color 0.15s ease;
		font-family: 'IBM Plex Mono', monospace;
	}

	.footer-link:hover {
		color: #0078d4;
	}
</style>
