import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !this.app.inProduction
  protected renderStatusPages = this.app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as any

      // Handle validation errors
      if (err.code === 'E_VALIDATION_ERROR') {
        return ctx.response.status(422).json({
          message: 'Validation failed',
          errors: err.messages,
        })
      }

      // Handle not found errors
      if (err.code === 'E_ROW_NOT_FOUND') {
        return ctx.response.status(404).json({
          message: 'Resource not found',
        })
      }

      // Handle unauthorized errors
      if (err.code === 'E_UNAUTHORIZED_ACCESS') {
        return ctx.response.status(401).json({
          message: 'Unauthorized access',
        })
      }
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
