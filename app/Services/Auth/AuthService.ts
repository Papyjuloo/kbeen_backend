import User from '#models/User'
import hash from '@adonisjs/core/services/hash'

export default class AuthService {
  /**
   * Register a new user
   */
  async register(data: {
    email: string
    password: string
    name: string
    phone?: string
  }): Promise<User> {
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
    })

    return user
  }

  /**
   * Login a user
   */
  async login(email: string, password: string, auth: any): Promise<string> {
    const user = await User.findBy('email', email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = await auth.use('api').generate(user)
    return token
  }

  /**
   * Update user profile
   */
  async updateProfile(user: User, data: { name?: string; phone?: string }): Promise<User> {
    user.merge(data)
    await user.save()
    return user
  }

  /**
   * Change user password
   */
  async changePassword(user: User, currentPassword: string, newPassword: string): Promise<void> {
    const isPasswordValid = await hash.verify(user.password, currentPassword)
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    user.password = newPassword
    await user.save()
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await User.findBy('email', email)
    if (!user) {
      // Don't reveal if user exists
      return
    }

    // Generate reset token and send email
    // Implementation depends on email service
    // TODO: Implement password reset token generation and email sending
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    // Verify token and reset password
    // TODO: Implement token verification and password reset
  }
}
