import { TextEncoder } from 'util';

export async function verifyTokenEdge(token: string): Promise<{ userId?: string; userRole?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {};
    }
    const payload = JSON.parse(atob(parts[1]));

    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      return {};
    }

    return { 
      userId: payload.id,
      userRole: payload.userRole 
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {};
  }
}

export async function generateTokenEdge(payload: { userId: string }): Promise<string> {
  const encoder = new TextEncoder();
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const secret = process.env.JWT_SECRET!;
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    data
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}