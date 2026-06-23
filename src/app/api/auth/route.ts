import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  
  if (provider !== 'github') {
    return NextResponse.json({ error: 'Provedor não suportado' }, { status: 400 });
  }

  const clientId = process.env.OAUTH_CLIENT_ID || 'Ov23liKD9oHFhyhmDzhk';
  const scope = 'repo,user';
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  
  return NextResponse.redirect(githubAuthUrl);
}
