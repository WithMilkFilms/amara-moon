import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const redirectUri = `${request.nextUrl.origin}/api/callback`
  const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`
  return NextResponse.redirect(authorizeUrl)
}
