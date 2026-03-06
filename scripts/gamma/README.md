# Gamma API (server)

We use Gamma's public API to generate presentations/docs/webpages from prompts and notes.

Docs: https://developers.gamma.app/docs/getting-started

## Credentials

Either:
- set env var `GAMMA_API_KEY`, or
- store the API key at `/root/.clawdbot/credentials/gamma.token` (chmod 600)

## Status

⚠️ **Current issue:** calls from this server to `https://public-api.gamma.app` are returning **Cloudflare 403 Access denied**.

That means the API key is stored, but we cannot execute generation requests from this host until Gamma allows server-side access (or we route requests through an allowed environment).

## Generate a doc (when unblocked)

```bash
python3 scripts/gamma/gamma_generate.py \
  --format document \
  --text-mode preserve \
  --input "# ARQIA\n---\nModern interiors..."
```

The output JSON includes:
- `status`
- `gammaUrl`
- `credits`

## Notes

- Create: `POST https://public-api.gamma.app/v1.0/generations`
- Poll:   `GET  https://public-api.gamma.app/v1.0/generations/{generationId}`

