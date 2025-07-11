import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log(" Starting Predictions API...");

    // Decode credentials from base64
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8')
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = 'Daily Predictions!A2:F';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    console.log(" Sheets data fetched:", response.data.values.length, "rows");

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const latestDate = rows[rows.length - 1][0];

    const filtered = rows
      .filter((r) => r[0] === latestDate)
      .map((r) => ({
        time: r[0],
        predicted: parseFloat(r[3]),
        actual: parseFloat(r[4]),
        accuracy: parseFloat(r[5]),
      }));

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("❌ Google Sheets error:", error);
    return res.status(500).json({ error: 'Failed to fetch predictions' });
  }
}
