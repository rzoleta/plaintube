<svelte:head>
	<title>Terms — PlainTube</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="root">
	<main class="card">
		<header>
			<div class="rule"></div>
			<div class="wordmark-row">
				<span class="wordmark">Terms of Use</span>
				<a href="/login" class="back">← PlainTube</a>
			</div>
			<div class="rule"></div>
		</header>

		<div class="body">
			<p class="lede">PlainTube is free, open-source software. These terms are short because there isn't much to say.</p>

			<section>
				<h2>Use it freely</h2>
				<p>PlainTube is free to use for personal, non-commercial purposes. The source code is released under the <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0 license</a> — you're free to run, study, and modify it.</p>
			</section>

			<section>
				<h2>YouTube's rules apply</h2>
				<p>PlainTube is built on the YouTube Data API. By using PlainTube, you also agree to <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube's Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>. Don't use PlainTube in ways that would violate those terms.</p>
			</section>

			<section>
				<h2>No warranty</h2>
				<p>PlainTube is provided as-is. We make no guarantees about uptime, accuracy, or continued availability. The service may change or shut down at any time.</p>
			</section>

			<section>
				<h2>Your data</h2>
				<p>You own your data. Since we don't store any of it, there's nothing to delete or export on our end. See our <a href="/privacy">Privacy Policy</a> for details.</p>
			</section>

			<section>
				<h2>Changes</h2>
				<p>We may update these terms. Continued use after changes are posted means you accept the new terms.</p>
				<p class="meta">Last updated: May 2025</p>
			</section>
		</div>

		<footer>
			<div class="rule"></div>
			<div class="footer-row">
				<a href="/login" class="footer-link">← Back</a>
				<a href="/privacy" class="footer-link">Privacy</a>
			</div>
		</footer>
	</main>
</div>

<style>
	:global(body) { margin: 0; }

	.root {
		min-height: 100svh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		background-color: #f5f5f5;
		padding: 3rem 1rem;
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
	}

	:global(.dark) .root { background-color: #111; }

	.card {
		width: 100%;
		max-width: 520px;
		background: #fff;
		border: 1px solid #e0e0e0;
	}

	:global(.dark) .card {
		background: #1a1a1a;
		border-color: #2a2a2a;
	}

	.rule {
		height: 3px;
		background-color: #0078d4;
	}

	.wordmark-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 1rem 1.5rem 0.875rem;
	}

	.wordmark {
		font-family: 'IBM Plex Mono', monospace;
		font-weight: 600;
		font-size: 1.04rem;
		color: #111;
	}

	:global(.dark) .wordmark { color: #f0f0f0; }

	.back {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		color: #999;
		text-decoration: none;
		transition: color 0.15s;
	}

	.back:hover { color: #0078d4; }

	.body {
		padding: 1.75rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.lede {
		margin: 0;
		font-size: 0.94rem;
		color: #555;
		border-left: 2px solid #0078d4;
		padding-left: 0.875rem;
		line-height: 1.5;
	}

	:global(.dark) .lede { color: #aaa; }

	section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	h2 {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #0078d4;
	}

	p {
		margin: 0;
		font-size: 0.85rem;
		color: #333;
		line-height: 1.65;
	}

	:global(.dark) p { color: #ccc; }

	a {
		color: #0078d4;
		text-decoration: none;
	}

	a:hover { text-decoration: underline; }

	.meta {
		color: #999 !important;
		font-size: 0.75rem !important;
	}

	footer {
		display: flex;
		flex-direction: column;
	}

	.footer-row {
		padding: 0.625rem 1.5rem;
		background: #fafafa;
		display: flex;
		justify-content: space-between;
	}

	:global(.dark) .footer-row { background: #141414; }

	.footer-link {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.73rem;
		color: #999;
		text-decoration: none;
		transition: color 0.15s;
	}

	.footer-link:hover { color: #0078d4; }
</style>
