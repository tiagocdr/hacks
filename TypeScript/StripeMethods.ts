import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})
// Use when register a user that will have a credit card.
export const createStripeCustomer = async (name: string, email: string, userID: number) => {
  try {
    const stripeCustomer = stripe.customers.create({
      name: name,
      email: email,
      metadata: {
        id: userID,
      },
    })
    return stripeCustomer
  } catch (err) {
    throw err
  }
}

// Get stripe customer profile
export const retrieveCustomer = async (stripeId) => {
  try {
    const stripeProfile = stripe.customers.retrieve(stripeId)
    return stripeProfile
  } catch (err) {
    return err
  }
}
// TO create a pending transaction
export const chargeCustomer = async (cardId: string, amount: number, customerId?: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: cardId,
      customer: customerId,
      off_session: false,
      capture_method: 'manual',
    })

    return paymentIntent
  } catch (err) {
    return err
  }
}

// Used imediatly to confirm the payment after the creation of the transaction.
export const confirmPayment = async (intent: string, paymentMethod: string) => {
  const paymentIntent = await stripe.paymentIntents.confirm(intent, {
    payment_method: paymentMethod,
  })
  return paymentIntent
}

// Complete transaction when needed
export const captureFunds = async (paymentIntent: string, amount: number) => {
  try {
    const intent = await stripe.paymentIntents.capture(paymentIntent, {
      amount_to_capture: amount * 100,
    })

    return intent
  } catch (err) {
    return err
  }
}

export const cancelOrder = async (paymentIntent: string) => {
  try {
    let res = await stripe.paymentIntents.cancel(paymentIntent)
    return res
  } catch (error) {
    return error
  }
}

export const refundFullOrder = async (paymentIntent: string) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent,
  })
  return refund
}
//Refund only  a partial ammount
export const refundPartialOrder = async (paymentIntent: string, amount: number) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent,
    amount: amount,
  })
  return refund
}

export const paymentMethodAssociation = async (customerID: string, paymentMethodId: string) => {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerID,
    })
    return 'ok'
  } catch (error) {
    return error
  }
}

export const createPaymentMethod = async (
  cardNumber: string,
  expMonth: number,
  expYear: number,
  cvvCode: string
) => {
  try {
    const paymentMethod: Stripe.PaymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvvCode,
      },
    })
    return paymentMethod
  } catch (error) {
    return error
  }
}
