import Payment from '#models/Payment'
import Reservation from '#models/Reservation'
import Stripe from 'stripe'
import env from '#start/env'

export default class PaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    })
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(
    userId: number,
    reservationId: number,
    amount: number,
    currency: string
  ) {
    // Verify reservation belongs to user
    const reservation = await Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .firstOrFail()

    if (reservation.status === 'cancelled') {
      throw new Error('Cannot create payment for cancelled reservation')
    }

    // Create Stripe payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: userId.toString(),
        reservationId: reservationId.toString(),
      },
    })

    // Save payment record
    const payment = await Payment.create({
      userId,
      reservationId,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    }
  }

  /**
   * Confirm a payment
   */
  async confirmPayment(paymentIntentId: string, userId: number) {
    const payment = await Payment.query()
      .where('stripe_payment_intent_id', paymentIntentId)
      .where('user_id', userId)
      .firstOrFail()

    // Retrieve payment intent from Stripe
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed'
      payment.paidAt = new Date()
      await payment.save()

      // Update reservation status
      const reservation = await Reservation.findOrFail(payment.reservationId)
      reservation.status = 'confirmed'
      await reservation.save()
    }

    return payment
  }

  /**
   * Get all payments for a user
   */
  async getUserPayments(userId: number, options: { page: number; limit: number }) {
    return await Payment.query()
      .where('user_id', userId)
      .preload('reservation')
      .orderBy('created_at', 'desc')
      .paginate(options.page, options.limit)
  }

  /**
   * Get a specific payment
   */
  async getPaymentById(id: number, userId: number) {
    return await Payment.query()
      .where('id', id)
      .where('user_id', userId)
      .preload('reservation')
      .firstOrFail()
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: number, userId: number, amount?: number, reason?: string) {
    const payment = await this.getPaymentById(paymentId, userId)

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded')
    }

    // Create Stripe refund
    const refund = await this.stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as any,
    })

    // Update payment status
    payment.status = 'refunded'
    payment.refundedAt = new Date()
    await payment.save()

    // Update reservation status
    const reservation = await Reservation.findOrFail(payment.reservationId)
    reservation.status = 'cancelled'
    await reservation.save()

    return refund
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(payload: string, signature: string) {
    const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')

    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (error) {
      throw new Error('Invalid webhook signature')
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const payment = await Payment.findBy('stripe_payment_intent_id', paymentIntent.id)
    if (payment) {
      payment.status = 'completed'
      payment.paidAt = new Date()
      await payment.save()

      const reservation = await Reservation.findOrFail(payment.reservationId)
      reservation.status = 'confirmed'
      await reservation.save()
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await Payment.findBy('stripe_payment_intent_id', paymentIntent.id)
    if (payment) {
      payment.status = 'failed'
      await payment.save()
    }
  }

  /**
   * Handle refunded charge
   */
  private async handleChargeRefunded(charge: Stripe.Charge) {
    const payment = await Payment.findBy('stripe_payment_intent_id', charge.payment_intent as string)
    if (payment) {
      payment.status = 'refunded'
      payment.refundedAt = new Date()
      await payment.save()
    }
  }

  /**
   * Get payment methods for user
   */
  async getPaymentMethods(userId: number) {
    // In a real implementation, you'd store customer ID in user model
    // For now, this is a placeholder
    return []
  }

  /**
   * Attach a payment method to user
   */
  async attachPaymentMethod(userId: number, paymentMethodId: string) {
    // Implementation depends on how you store customer IDs
    // This is a placeholder
    return { id: paymentMethodId }
  }

  /**
   * Detach a payment method from user
   */
  async detachPaymentMethod(userId: number, paymentMethodId: string) {
    // Implementation depends on how you store customer IDs
    // This is a placeholder
  }
}
