import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pollId } = req.query;

  if (req.method === "GET") {
    const response = await fetch(`http://localhost:3333/polls/${pollId}`);
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "POST") {
    const response = await fetch(`http://localhost:3333/polls/${pollId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    return res.status(response.status).json(await response.json());
  }
}
