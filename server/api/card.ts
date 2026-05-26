type CardPaymentRequest = {
  card_number?: string
  expiration_date?: string
  security_code?: string
  amount?: number
  company_account_number?: string
}

function sanitizeDigits(value: string | undefined) {
  return (value ?? '').replace(/\D/g, '')
}

function isValidLuhn(cardNumber: string) {
  let sum = 0
  let shouldDouble = false

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number(cardNumber[i])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

function isValidExpirationDate(expirationDate: string | undefined) {
  if (!expirationDate) {
    return false
  }

  const match = expirationDate.match(/^(\d{2})\/(\d{2})$/)
  if (!match) {
    return false
  }

  const month = Number(match[1])
  const year = Number(match[2])

  if (month < 1 || month > 12) {
    return false
  }

  const now = new Date()
  const fullYear = 2000 + year
  const expiration = new Date(fullYear, month, 0, 23, 59, 59, 999)

  return expiration >= now
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<CardPaymentRequest>(event)

  const cardNumber = sanitizeDigits(body.card_number)
  const securityCode = sanitizeDigits(body.security_code)
  const amount = Number(body.amount)
  const configuredAccount = String(config.public.companyAccount ?? '')
  const requestedAccount = String(body.company_account_number ?? '')

  if (!cardNumber || !securityCode || !body.expiration_date) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Faltan datos obligatorios de la tarjeta.'
    }
  }

  if (cardNumber.length < 13 || cardNumber.length > 19 || !isValidLuhn(cardNumber)) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'El número de tarjeta no es válido.'
    }
  }

  if (!/^\d{3,4}$/.test(securityCode)) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'El código de seguridad no es válido.'
    }
  }

  if (!isValidExpirationDate(body.expiration_date)) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'La tarjeta está vencida o la fecha no es válida.'
    }
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'El monto del pago no es válido.'
    }
  }

  if (!configuredAccount || requestedAccount !== configuredAccount) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'La cuenta de la empresa no coincide.'
    }
  }

  return {
    success: true,
    authorization_code: crypto.randomUUID().slice(0, 8).toUpperCase(),
    message: 'Pago procesado correctamente.'
  }
})
