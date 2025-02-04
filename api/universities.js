export default async function handler(req, res) {
  const { country } = req.query;

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`
    );
    
    if (!response.ok) throw new Error("API failed");
    
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}