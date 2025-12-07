import type { HttpContext } from '@adonisjs/core/http'
import IotDevice from '#models/iot_device'
import IotService from '#services/iot_service'

export default class IotController {
  /**
   * List all IoT devices
   */
  async listDevices({ response }: HttpContext) {
    const devices = await IotDevice.query().orderBy('createdAt', 'desc')

    return response.ok({ data: devices })
  }

  /**
   * Register a new IoT device
   */
  async registerDevice({ request, response }: HttpContext) {
    const payload = request.only(['deviceId', 'name', 'type', 'location', 'metadata'])

    const device = await IotDevice.create({
      ...payload,
      status: 'offline',
    })

    return response.created({
      message: 'Device registered successfully',
      data: device,
    })
  }

  /**
   * Get device details
   */
  async getDevice({ params, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)

    return response.ok({ data: device })
  }

  /**
   * Update device
   */
  async updateDevice({ params, request, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)
    const payload = request.only(['name', 'location', 'metadata', 'status'])

    device.merge(payload)
    await device.save()

    return response.ok({
      message: 'Device updated successfully',
      data: device,
    })
  }

  /**
   * Delete device
   */
  async deleteDevice({ params, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)
    await device.delete()

    return response.ok({ message: 'Device deleted successfully' })
  }

  /**
   * Send command to device
   */
  async sendCommand({ params, request, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)
    const { command, payload } = request.only(['command', 'payload'])

    const iotService = new IotService()
    await iotService.sendCommand(device.deviceId, command, payload)

    return response.ok({
      message: 'Command sent successfully',
    })
  }

  /**
   * Get device status
   */
  async getDeviceStatus({ params, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)

    return response.ok({
      data: {
        deviceId: device.deviceId,
        status: device.status,
        lastSeenAt: device.lastSeenAt,
      },
    })
  }

  /**
   * Get device logs
   */
  async getDeviceLogs({ params, response }: HttpContext) {
    const device = await IotDevice.findOrFail(params.id)

    // TODO: Implement device logs retrieval from a logging service or database
    const logs = []

    return response.ok({ data: logs })
  }
}
