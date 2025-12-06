export default class PaymentListener {
  async onSuccess(payment: any) {
    console.log('Payment succeeded:', payment.id)
    // TODO: Update reservation status, send receipt
  }

  async onFailure(payment: any) {
    console.log('Payment failed:', payment.id)
    // TODO: Notify user of payment failure
  }

  async onRefund(payment: any) {
    console.log('Payment refunded:', payment.id)
    // TODO: Process refund, update reservation
  }
}
