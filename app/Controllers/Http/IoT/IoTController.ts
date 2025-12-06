import type { HttpContext } from '@adonisjs/core/http'
import IoTService from '#services/IoT/IoTService'

export default class IoTController {
  private iotService: IoTService

  constructor() {
    this.iotService = new IoTService()
  }

  /**
   * Get all IoT devices
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')

      const devices = await this.iotService.getDevices({ page, limit, status })
      return response.ok(devices)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get a specific IoT device
   */
  async show({ params, response }: HttpContext) {
    try {
      const device = await this.iotService.getDeviceById(params.id)
      return response.ok({ device })
    } catch (error) {
      return response.notFound({ message: error.message })
    }
  }

  /**
   * Register a new IoT device
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'type', 'macAddress', 'location', 'resourceId'])
      const device = await this.iotService.registerDevice(data)
      return response.created({ device })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Update IoT device
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'location', 'status', 'resourceId'])
      const device = await this.iotService.updateDevice(params.id, data)
      return response.ok({ device })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Delete IoT device
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.iotService.deleteDevice(params.id)
      return response.ok({ message: 'Device deleted successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Send command to IoT device
   */
  async sendCommand({ params, request, response }: HttpContext) {
    try {
      const { command, payload } = request.only(['command', 'payload'])
      const result = await this.iotService.sendCommand(params.id, command, payload)
      return response.ok({ result })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get device status
   */
  async getStatus({ params, response }: HttpContext) {
    try {
      const status = await this.iotService.getDeviceStatus(params.id)
      return response.ok({ status })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get device telemetry data
   */
  async getTelemetry({ params, request, response }: HttpContext) {
    try {
      const startDate = request.input('startDate')
      const endDate = request.input('endDate')
      const page = request.input('page', 1)
      const limit = request.input('limit', 50)

      const telemetry = await this.iotService.getDeviceTelemetry(params.id, {
        startDate,
        endDate,
        page,
        limit,
      })
      return response.ok(telemetry)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Control door lock
   */
  async controlLock({ params, request, response }: HttpContext) {
    try {
      const { action } = request.only(['action']) // 'lock' or 'unlock'
      const result = await this.iotService.controlDoorLock(params.id, action)
      return response.ok({ result })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get device logs
   */
  async getLogs({ params, request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 50)
      const logType = request.input('type')

      const logs = await this.iotService.getDeviceLogs(params.id, { page, limit, logType })
      return response.ok(logs)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get devices by resource
   */
  async getDevicesByResource({ params, response }: HttpContext) {
    try {
      const devices = await this.iotService.getDevicesByResource(params.resourceId)
      return response.ok({ devices })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Test device connectivity
   */
  async testConnectivity({ params, response }: HttpContext) {
    try {
      const result = await this.iotService.testDeviceConnectivity(params.id)
      return response.ok({ result })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
