
export const generateToken = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserId: process.env.NEXT_PUBLIC_TOKEN_USER_ID, Password: process.env.NEXT_PUBLIC_TOKEN_PASSWORD }),
    });
    if (!response.ok) throw new Error("Token generation failed");
    const data = await response.json();
    return data.result[0].tokenKey;
  };
  