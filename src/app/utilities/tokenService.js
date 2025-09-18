
export const generateToken = async () => {
    const response = await fetch("https://staahbe.cinuniverse.com/GenerateToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserId: "clarks_pg", Password: "clarks@2025" }),
    });
    if (!response.ok) throw new Error("Token generation failed");
    const data = await response.json();
    return data.result[0].tokenKey;
  };
  