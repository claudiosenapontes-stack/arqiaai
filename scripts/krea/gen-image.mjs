#!/usr/bin/env node
/**
 * Krea image generator (async job + poll + download)
 *
 * Token is read from /root/.clawdbot/credentials/krea.token (or KREA_API_TOKEN env).
 *
 * Usage:
 *   node scripts/krea/gen-image.mjs --out public/collections/calma-1.png \
 *     --model /generate/image/krea-1 \
 *     --prompt "..."
 */

import fs from 'node:fs'
import path from 'node:path'

const API_BASE = 'https://api.krea.ai'

function arg(name) {
  const i = process.argv.indexOf(name)
  return i >= 0 ? process.argv[i + 1] : null
}

function has(name) {
  return process.argv.includes(name)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function readToken() {
  const env = process.env.KREA_API_TOKEN
  if (env && env.trim()) return env.trim()
  const p = '/root/.clawdbot/credentials/krea.token'
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim()
  throw new Error('Missing Krea API token (set KREA_API_TOKEN or create /root/.clawdbot/credentials/krea.token)')
}

async function apiFetch(token, urlPath, { method = 'GET', body } = {}) {
  const res = await fetch(API_BASE + urlPath, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`Krea API ${method} ${urlPath} failed: ${res.status} ${res.statusText}\n${JSON.stringify(json, null, 2)}`)
  }
  return json
}

async function download(url, outPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText} (${url})`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
}

async function main() {
  const prompt = arg('--prompt')
  const out = arg('--out')
  const model = arg('--model') || '/generate/image/krea-1'
  const pollMs = Number(arg('--poll-ms') || 2000)
  const timeoutMs = Number(arg('--timeout-ms') || 180000)

  if (!prompt) throw new Error('Missing --prompt')
  if (!out) throw new Error('Missing --out')

  const token = readToken()

  const body = {
    prompt,
    // common params (ignored if unsupported)
    num_images: 1,
    output_format: 'png',
    // keep it roughly "collection card" aspect
    aspect_ratio: '21:9',
  }

  if (has('--debug')) {
    console.error('MODEL', model)
    console.error('BODY', JSON.stringify(body, null, 2))
  }

  const job = await apiFetch(token, model, { method: 'POST', body })
  const jobId = job.job_id || job.jobId || job.id
  if (has('--debug')) console.error('JOB', JSON.stringify(job, null, 2))
  if (!jobId) throw new Error(`No job id returned: ${JSON.stringify(job)}`)

  const started = Date.now()
  while (true) {
    const j = await apiFetch(token, `/jobs/${jobId}`)
    const status = j.status

    if (has('--debug')) {
      console.error('STATUS', status)
    }

    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      if (has('--debug')) console.error('JOB_RESULT', JSON.stringify(j, null, 2))
      let urls = null
      if (Array.isArray(j?.result?.urls)) urls = j.result.urls
      else if (j?.result?.url) urls = [j.result.url]
      else if (Array.isArray(j?.result?.images)) urls = j.result.images.map((im) => im?.url).filter(Boolean)
      else if (j?.result?.image?.url) urls = [j.result.image.url]
      else if (Array.isArray(j?.urls)) urls = j.urls

      if (!urls || !urls.length) throw new Error(`Job completed but no result urls: ${JSON.stringify(j, null, 2)}`)
      await download(urls[0], out)
      process.stdout.write(out + '\n')
      return
    }

    if (status === 'failed' || status === 'error' || status === 'canceled' || status === 'cancelled') {
      throw new Error(`Job ${jobId} ${status}: ${JSON.stringify(j, null, 2)}`)
    }

    if (Date.now() - started > timeoutMs) {
      throw new Error(`Timed out waiting for job ${jobId}. Last: ${JSON.stringify(j, null, 2)}`)
    }

    await sleep(pollMs)
  }
}

main().catch((e) => {
  console.error(e?.stack || String(e))
  process.exit(1)
})
