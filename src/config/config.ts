export const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(`JWT_SECRET must be defined`);
}

export const config = {
  JWT_SECRET,
  jwtExpiresIn: '15m',
} as const;
