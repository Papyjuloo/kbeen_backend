import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/User'
import AuthService from '#services/Auth/AuthService'

export default class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password', 'name', 'phone'])
      const user = await this.authService.register(data)
      return response.created({ user })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Login a user
   */
  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const token = await this.authService.login(email, password, auth)
      return response.ok({ token })
    } catch (error) {
      return response.unauthorized({ message: error.message })
    }
  }

  /**
   * Logout a user
   */
  async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('api').revoke()
      return response.ok({ message: 'Logged out successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      return response.ok({ user })
    } catch (error) {
      return response.unauthorized({ message: error.message })
    }
  }

  /**
   * Update user profile
   */
  async updateProfile({ request, response, auth }: HttpContext) {
    try {
      const data = request.only(['name', 'phone'])
      const user = await this.authService.updateProfile(auth.user!, data)
      return response.ok({ user })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Change user password
   */
  async changePassword({ request, response, auth }: HttpContext) {
    try {
      const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])
      await this.authService.changePassword(auth.user!, currentPassword, newPassword)
      return response.ok({ message: 'Password changed successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])
      await this.authService.forgotPassword(email)
      return response.ok({ message: 'Password reset email sent' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword({ request, response }: HttpContext) {
    try {
      const { token, password } = request.only(['token', 'password'])
      await this.authService.resetPassword(token, password)
      return response.ok({ message: 'Password reset successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
