import Stripe from 'stripe'
import env from '#start/env'

export default class PaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    })
  }

  async createIntent(params: {
    amount: number
    currency: string
    metadata?: Record<string, any>
  }) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })
  }

  async confirmPayment(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }

    if (amount) {
      refundParams.amount = Math.round(amount * 100)
    }

    return this.stripe.refunds.create(refundParams)
  }

  async handleWebhook(payload: { headers: Record<string, string>; body: string }) {
    const sig = payload.headers['stripe-signature']
    const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload.body,
        sig,
        webhookSecret
      )

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          break
        case 'payment_intent.payment_failed':
          // Handle failed payment
          break
        default:
          console.log(`Unhandled event type ${event.type}`)
      }

      return event
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`)
    }
  }
}
