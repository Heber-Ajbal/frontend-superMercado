export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    const response = await fetch('https://analisis-sistema-backend-yqm9.onrender.com/api/payments/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  
    const data = await response.json()
    return data
  })
  