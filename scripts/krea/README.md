# Krea (API) – ARQIA Asset Pipeline

This folder will hold scripts/utilities to generate images/videos with Krea and convert them into web-ready assets for arqiaai.

## Credentials

- Token path: `/root/.clawdbot/credentials/krea.token`
- Keep it private. Rotate in Krea if leaked.

## Planned outputs

- Images → `public/mock/*` or `public/products/*`
- Hero/section video loops → `public/hero/*` or `public/sequence/*`
- Always produce MP4 + WebM + poster frame.

## Next

Implement a script that:
1) calls Krea API to generate video/image
2) downloads result
3) runs ffmpeg to produce:
   - MP4 (H.264, yuv420p, faststart)
   - WebM (VP9)
   - poster JPG
