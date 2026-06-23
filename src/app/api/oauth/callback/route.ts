import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Nenhum código de autorização fornecido' }, { status: 400 });
  }

  const clientId = process.env.OAUTH_CLIENT_ID || 'Ov23liKD9oHFhyhmDzhk';
  const clientSecret = process.env.OAUTH_CLIENT_SECRET || 'affaa9285362843d20bf50410fe6c00246d9e975';

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
    }

    // Decap CMS espera receber uma mensagem que envie o token via postMessage
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Autenticação Concluída</title>
      </head>
      <body>
        <p>Autenticando com o GitHub, aguarde...</p>
        <script>
          const receiveMessage = (e) => {
            // Verifica a origem se necessário
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: data.access_token,
                provider: 'github',
              })}',
              e.origin
            );
          };
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        </script>
      </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno ao autenticar no GitHub' }, { status: 500 });
  }
}
