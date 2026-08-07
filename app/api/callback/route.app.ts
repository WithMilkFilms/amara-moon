import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (tokenData.error) {
    const message = JSON.stringify(tokenData).replace(/</g, '\\u003c')
    return new NextResponse(
      `<script>window.opener.postMessage('authorization:github:error:${message}', '*')</script>`,
      { headers: { 'Content-Type': 'text/html' } },
    )
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' }).replace(
    /</g,
    '\\u003c',
  )

  const script = `
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage('authorization:github:success:${payload}', e.origin)
          window.removeEventListener('message', receiveMessage, false)
        }
        window.addEventListener('message', receiveMessage, false)
        window.opener.postMessage('authorizing:github', '*')
      })()
    </script>
  `

  return new NextResponse(script, { headers: { 'Content-Type': 'text/html' } })
}
