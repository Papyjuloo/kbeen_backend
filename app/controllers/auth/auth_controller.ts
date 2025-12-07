import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth_validator'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    
    const user = await User.create({
      ...payload,
      password: await User.hashPassword(payload.password),
      role: 'user',
      isActive: true,
    })

    return response.created({
      message: 'User registered successfully',
      data: user.serialize(),
    })
  }

  /**
   * Login user
   */
  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    
    const user = await User.findByOrFail('email', email)
    
    if (!(await user.verifyPassword(password))) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    await auth.use('web').login(user)

    return response.ok({
      message: 'Login successful',
      data: user.serialize(),
    })
  }

  /**
   * Logout user
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    
    return response.ok({ message: 'Logout successful' })
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    
    return response.ok({ data: user.serialize() })
  }

  /**
   * Update user profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = request.only(['fullName', 'phoneNumber'])
    
    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'Profile updated successfully',
      data: user.serialize(),
    })
  }

  /**
   * Forgot password
   */
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    
    // TODO: Implement password reset token and email sending
    
    return response.ok({ message: 'Password reset instructions sent to your email' })
  }

  /**
   * Reset password
   */
  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])
    
    // TODO: Implement password reset logic
    
    return response.ok({ message: 'Password reset successfully' })
  }
}
