// utils/requireUser.js
export async function requireUser(expectedType = null) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/me`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  const user = data?.user;

  console.log("User fetched:", user);

  if (!user) return null;
  if (expectedType && user.userType !== expectedType) return null;

  return user;
}
