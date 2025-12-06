import type { HttpContext } from '@adonisjs/core/http'
import PaymentService from '#services/Payments/PaymentService'

export default class PaymentsController {
  private paymentService: PaymentService

  constructor() {
    this.paymentService = new PaymentService()
  }

  /**
   * Create a payment intent for a reservation
   */
  async createPaymentIntent({ request, response, auth }: HttpContext) {
    try {
      const { reservationId, amount, currency } = request.only([
        'reservationId',
        'amount',
        'currency',
      ])

      const paymentIntent = await this.paymentService.createPaymentIntent(
        auth.user!.id,
        reservationId,
        amount,
        currency || 'usd'
      )

      return response.ok({ paymentIntent })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Confirm a payment
   */
  async confirmPayment({ request, response, auth }: HttpContext) {
    try {
      const { paymentIntentId } = request.only(['paymentIntentId'])
      const payment = await this.paymentService.confirmPayment(paymentIntentId, auth.user!.id)
      return response.ok({ payment })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get all payments for authenticated user
   */
  async index({ request, response, auth }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const payments = await this.paymentService.getUserPayments(auth.user!.id, { page, limit })
      return response.ok(payments)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get a specific payment
   */
  async show({ params, response, auth }: HttpContext) {
    try {
      const payment = await this.paymentService.getPaymentById(params.id, auth.user!.id)
      return response.ok({ payment })
    } catch (error) {
      return response.notFound({ message: error.message })
    }
  }

  /**
   * Refund a payment
   */
  async refund({ params, request, response, auth }: HttpContext) {
    try {
      const { amount, reason } = request.only(['amount', 'reason'])
      const refund = await this.paymentService.refundPayment(
        params.id,
        auth.user!.id,
        amount,
        reason
      )
      return response.ok({ refund })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Handle Stripe webhook
   */
  async webhook({ request, response }: HttpContext) {
    try {
      const signature = request.header('stripe-signature')
      if (!signature) {
        return response.badRequest({ message: 'Missing stripe signature' })
      }

      await this.paymentService.handleWebhook(request.raw(), signature)
      return response.ok({ received: true })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get payment methods for user
   */
  async getPaymentMethods({ response, auth }: HttpContext) {
    try {
      const paymentMethods = await this.paymentService.getPaymentMethods(auth.user!.id)
      return response.ok({ paymentMethods })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Add a payment method
   */
  async addPaymentMethod({ request, response, auth }: HttpContext) {
    try {
      const { paymentMethodId } = request.only(['paymentMethodId'])
      const paymentMethod = await this.paymentService.attachPaymentMethod(
        auth.user!.id,
        paymentMethodId
      )
      return response.ok({ paymentMethod })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Remove a payment method
   */
  async removePaymentMethod({ params, response, auth }: HttpContext) {
    try {
      await this.paymentService.detachPaymentMethod(auth.user!.id, params.paymentMethodId)
      return response.ok({ message: 'Payment method removed successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
