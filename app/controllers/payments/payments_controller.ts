import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import Reservation from '#models/reservation'
import PaymentService from '#services/payment_service'

export default class PaymentsController {
  /**
   * Create a payment intent
   */
  async createPaymentIntent({ request, response }: HttpContext) {
    const { reservationId, amount, currency } = request.only(['reservationId', 'amount', 'currency'])

    const reservation = await Reservation.findOrFail(reservationId)
    const paymentService = new PaymentService()

    const paymentIntent = await paymentService.createIntent({
      amount,
      currency: currency || 'eur',
      metadata: { reservationId: reservation.id },
    })

    return response.ok({
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    })
  }

  /**
   * Confirm a payment
   */
  async confirmPayment({ request, response }: HttpContext) {
    const { paymentIntentId, reservationId } = request.only(['paymentIntentId', 'reservationId'])

    const paymentService = new PaymentService()
    const paymentIntent = await paymentService.confirmPayment(paymentIntentId)

    const payment = await Payment.create({
      reservationId,
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert from cents to decimal
      currency: paymentIntent.currency,
      status: 'succeeded',
      metadata: paymentIntent.metadata,
    })

    return response.ok({
      message: 'Payment confirmed successfully',
      data: payment,
    })
  }

  /**
   * Get payment details
   */
  async show({ params, response }: HttpContext) {
    const payment = await Payment.query()
      .where('id', params.id)
      .preload('reservation')
      .firstOrFail()

    return response.ok({ data: payment })
  }

  /**
   * Get payment by reservation
   */
  async getByReservation({ params, response }: HttpContext) {
    const payment = await Payment.query()
      .where('reservationId', params.reservationId)
      .preload('reservation')
      .firstOrFail()

    return response.ok({ data: payment })
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook({ request, response }: HttpContext) {
    const paymentService = new PaymentService()
    
    try {
      await paymentService.handleWebhook(request.raw())
      return response.ok({ received: true })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Refund a payment
   */
  async refund({ params, response }: HttpContext) {
    const payment = await Payment.findOrFail(params.id)
    const paymentService = new PaymentService()

    await paymentService.refundPayment(payment.stripePaymentIntentId)
    
    payment.status = 'refunded'
    await payment.save()

    return response.ok({
      message: 'Payment refunded successfully',
      data: payment,
    })
  }
}
