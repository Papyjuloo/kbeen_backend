export default class ReservationListener {
  async onCreate(reservation: any) {
    console.log('Reservation created:', reservation.id)
    // TODO: Send confirmation email
  }

  async onConfirm(reservation: any) {
    console.log('Reservation confirmed:', reservation.id)
    // TODO: Send confirmation notification
  }

  async onCancel(reservation: any) {
    console.log('Reservation cancelled:', reservation.id)
    // TODO: Process cancellation and refund
  }
}
