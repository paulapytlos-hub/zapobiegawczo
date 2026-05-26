export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, rating } = req.body

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Wiadomość jest wymagana' })
  }

  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    return res.status(500).json({ error: 'Brak konfiguracji serwera' })
  }

  const fields = {
    Wiadomosc: message.trim(),
    Data: new Date().toISOString().split('T')[0],
  }
  if (rating && rating >= 1 && rating <= 5) {
    fields.Ocena = rating
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/Feedback`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Airtable error:', JSON.stringify(err))
      return res.status(502).json({ error: 'Błąd Airtable', detail: err })
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
