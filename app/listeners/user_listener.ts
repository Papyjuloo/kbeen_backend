export default class UserListener {
  async onRegistered(user: any) {
    console.log('User registered:', user.email)
    // TODO: Send welcome email
  }

  async onLogin(user: any) {
    console.log('User logged in:', user.email)
    // TODO: Track login activity
  }
}
