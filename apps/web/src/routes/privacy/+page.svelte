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
				<h2>Google user data accessed</h2>
				<p>PlainTube accesses the following Google user data via the YouTube Data API v3, using the <code>https://www.googleapis.com/auth/youtube.readonly</code> OAuth scope:</p>
				<ul>
					<li>Your YouTube channel subscriptions (list of channels you subscribe to)</li>
					<li>Your YouTube playlists and playlist items (including Watch Later)</li>
					<li>Basic YouTube account identity (channel ID and display name, used to identify your session)</li>
				</ul>
				<p>No other Google or YouTube data is accessed.</p>
			</section>

			<section>
				<h2>How we use that data</h2>
				<p>The subscription and playlist data is fetched on demand from the YouTube Data API and displayed directly in the PlainTube interface so you can browse your feed without YouTube's recommendation algorithm. It is used solely to render the app's UI during your active session. We do not analyze, mine, or process it for any other purpose.</p>
				<p>The OAuth access token Google provides is stored in an encrypted, HTTP-only session cookie in your browser. It is used only to make authenticated API calls to YouTube on your behalf. It is never written to a server-side database or logged.</p>
			</section>

			<section>
				<h2>Data sharing</h2>
				<p>We do not sell, rent, or share your Google user data with any third parties for advertising, marketing, or analytics purposes.</p>
				<p>The only data flows involving third parties are:</p>
				<ul>
					<li><strong>Google / YouTube:</strong> API requests are made to YouTube on your behalf using your access token. Google's own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> governs that data.</li>
					<li><strong>YouTube embeds:</strong> Videos you play are loaded via the standard YouTube embed player. YouTube may collect playback data under their own privacy policy.</li>
					<li><strong>Vercel:</strong> PlainTube is hosted on Vercel. Vercel may collect standard web server logs (IP address, user-agent, request path) as described in <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Vercel's Privacy Policy</a>. We do not pass Google user data to Vercel beyond what is incidentally present in normal HTTPS traffic.</li>
				</ul>
			</section>

			<section>
				<h2>Data storage &amp; protection</h2>
				<p>PlainTube has no server-side database. Google user data is never persisted on our infrastructure.</p>
				<p>Your OAuth access token is stored exclusively in an encrypted, HTTP-only, Secure session cookie. It cannot be read by client-side JavaScript and is transmitted only over HTTPS.</p>
				<p>Your watch history, saved videos, and inbox settings are stored in your browser's <code>localStorage</code>. This data never leaves your device and is not accessible to our servers.</p>
			</section>

			<section>
				<h2>Data retention &amp; deletion</h2>
				<p>Because we store no Google user data on our servers, there is nothing for us to delete. Your session cookie is cleared when you sign out or when it expires. Your <code>localStorage</code> data is deleted when you clear your browser storage.</p>
				<p>You can revoke PlainTube's access to your Google account at any time by visiting <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">Google Account Permissions</a> and removing PlainTube. This immediately invalidates the access token.</p>
				<p>To request confirmation that no data about you exists on our servers, or for any other data-related inquiry, email us at <a href="mailto:privacy@plaintube.tv">privacy@plaintube.tv</a>.</p>
			</section>

			<section>
				<h2>Analytics &amp; tracking</h2>
				<p>PlainTube uses Vercel Web Analytics to understand aggregate usage patterns — things like how many people visit the site, what device types and countries they come from, and which sites refer traffic here. No personally identifiable information is collected. There are no user IDs, no cross-session tracking, and no cookies. We cannot identify you from this data, and it is never shared with advertisers.</p>
				<p>No other analytics scripts, ad trackers, or third-party pixels are loaded.</p>
			</section>

			<section>
				<h2>Changes</h2>
				<p>If this policy changes in a meaningful way, we'll update this page and note the date below.</p>
				<p class="meta">Last updated: May 2026</p>
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

	ul {
		margin: 0.25rem 0 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	li {
		font-size: 0.85rem;
		color: #333;
		line-height: 1.65;
	}

	:global(.dark) li { color: #ccc; }

	a {
		color: #0078d4;
		text-decoration: none;
	}

	a:hover { text-decoration: underline; }

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
