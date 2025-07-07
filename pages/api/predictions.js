import { google } from 'googleapis';
export default async function handler(req, res) {
  try {
    console.log("🧠 Starting predictions API...");

    const auth = new google.auth.GoogleAuth({
     credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = 'Daily predictions!A2:F';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log("✅ Sheets data fetched:", response.data.values.length, "rows");

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const latestDate = rows[rows.length - 1][0];

    const filtered = rows
      .filter((r) => r[0] === latestDate)
      .map((r) => ({
        model: r[1],
        asset: r[2],
        predicted: r[3],
        actual: r[4],
        accuracy: r[5],
      }));

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("❌ Google Sheets error:", error.message);
    return res.status(500).json({ error: 'Failed to fetch predictions' });
  }
}
