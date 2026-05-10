<svelte:head>
	<title>Privacy — PlainTube</title>
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
				<span class="wordmark">Privacy Policy</span>
				<a href="/login" class="back">← PlainTube</a>
			</div>
			<div class="rule"></div>
		</header>

		<div class="body">
			<p class="lede">The short version: we don't collect your data. Here's what that actually means.</p>

			<section>
				<h2>What we store on our servers</h2>
				<p>Nothing. PlainTube has no database.</p>
				<p>When you sign in, Google sends us an access token. We wrap it in an encrypted, HTTP-only session cookie that lives in your browser. It is never written to a database or logged anywhere.</p>
			</section>

			<section>
				<h2>What stays in your browser</h2>
				<p>Everything else — your watch history, saved videos, and inbox settings — is stored in your browser's <code>localStorage</code>. It never leaves your device. Clearing your browser data deletes it permanently; we have no copy.</p>
			</section>

			<section>
				<h2>YouTube & Google</h2>
				<p>PlainTube uses the YouTube Data API to read your subscriptions and playlists. This means Google knows you authorized PlainTube. What you watch inside PlainTube is played through the standard YouTube embed — YouTube's own privacy policy applies to that playback.</p>
				<p>We request the minimum OAuth scope needed: read-only access to your YouTube account.</p>
			</section>

			<section>
				<h2>Analytics & tracking</h2>
				<p>None. No analytics scripts, no ad trackers, no third-party pixels.</p>
			</section>

			<section>
				<h2>Changes</h2>
				<p>If this policy changes in a meaningful way, we'll update this page and note the date below.</p>
				<p class="meta">Last updated: May 2025</p>
			</section>
		</div>

		<footer>
			<div class="rule"></div>
			<div class="footer-row">
				<a href="/login" class="footer-link">← Back</a>
				<a href="/terms" class="footer-link">Terms</a>
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

	code {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.81rem;
		background: #f0f0f0;
		padding: 0.1em 0.35em;
		border-radius: 2px;
	}

	:global(.dark) code {
		background: #2a2a2a;
		color: #ddd;
	}

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
