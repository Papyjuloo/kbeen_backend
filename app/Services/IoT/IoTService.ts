import IoTDevice from '#models/IoTDevice'
import IoTTelemetry from '#models/IoTTelemetry'
import IoTLog from '#models/IoTLog'
import mqtt from 'mqtt'
import env from '#start/env'
import { DateTime } from 'luxon'

export default class IoTService {
  private mqttClient: mqtt.MqttClient | null = null
  private topicPrefix: string

  constructor() {
    this.topicPrefix = env.get('MQTT_TOPIC_PREFIX')
    this.initializeMqttClient()
  }

  /**
   * Initialize MQTT client
   */
  private initializeMqttClient() {
    const brokerUrl = env.get('MQTT_BROKER_URL')
    const clientId = env.get('MQTT_CLIENT_ID')
    const username = env.get('MQTT_USERNAME')
    const password = env.get('MQTT_PASSWORD')

    try {
      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId,
        username,
        password,
        clean: true,
        reconnectPeriod: 5000,
      })

      this.mqttClient.on('connect', () => {
        console.log('MQTT client connected')
        this.subscribeToTopics()
      })

      this.mqttClient.on('message', (topic, message) => {
        this.handleMqttMessage(topic, message)
      })

      this.mqttClient.on('error', (error) => {
        console.error('MQTT error:', error)
      })
    } catch (error) {
      console.error('Failed to initialize MQTT client:', error)
    }
  }

  /**
   * Subscribe to MQTT topics
   */
  private subscribeToTopics() {
    if (!this.mqttClient) return

    const topics = [
      `${this.topicPrefix}/devices/+/status`,
      `${this.topicPrefix}/devices/+/telemetry`,
      `${this.topicPrefix}/devices/+/events`,
    ]

    topics.forEach((topic) => {
      this.mqttClient?.subscribe(topic, (error) => {
        if (error) {
          console.error(`Failed to subscribe to ${topic}:`, error)
        } else {
          console.log(`Subscribed to ${topic}`)
        }
      })
    })
  }

  /**
   * Handle incoming MQTT messages
   */
  private async handleMqttMessage(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString())
      const topicParts = topic.split('/')
      const deviceId = topicParts[2]
      const messageType = topicParts[3]

      const device = await IoTDevice.findBy('mqtt_device_id', deviceId)
      if (!device) {
        console.warn(`Device not found: ${deviceId}`)
        return
      }

      switch (messageType) {
        case 'status':
          await this.updateDeviceStatus(device, data)
          break
        case 'telemetry':
          await this.saveTelemetry(device, data)
          break
        case 'events':
          await this.handleDeviceEvent(device, data)
          break
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error)
    }
  }

  /**
   * Update device status
   */
  private async updateDeviceStatus(device: IoTDevice, data: any) {
    device.status = data.status || 'online'
    device.lastSeenAt = DateTime.now()
    await device.save()

    await IoTLog.create({
      deviceId: device.id,
      logType: 'status',
      message: `Device status changed to ${device.status}`,
      data: JSON.stringify(data),
    })
  }

  /**
   * Save telemetry data
   */
  private async saveTelemetry(device: IoTDevice, data: any) {
    await IoTTelemetry.create({
      deviceId: device.id,
      temperature: data.temperature,
      humidity: data.humidity,
      batteryLevel: data.batteryLevel,
      signalStrength: data.signalStrength,
      data: JSON.stringify(data),
    })
  }

  /**
   * Handle device events
   */
  private async handleDeviceEvent(device: IoTDevice, data: any) {
    await IoTLog.create({
      deviceId: device.id,
      logType: 'event',
      message: data.message || 'Device event',
      data: JSON.stringify(data),
    })
  }

  /**
   * Get all devices
   */
  async getDevices(options: { page: number; limit: number; status?: string }) {
    const query = IoTDevice.query().preload('resource').orderBy('created_at', 'desc')

    if (options.status) {
      query.where('status', options.status)
    }

    return await query.paginate(options.page, options.limit)
  }

  /**
   * Get device by ID
   */
  async getDeviceById(id: number) {
    return await IoTDevice.query().where('id', id).preload('resource').firstOrFail()
  }

  /**
   * Register a new device
   */
  async registerDevice(data: any) {
    const mqttDeviceId = `device-${Date.now()}-${Math.random().toString(36).substring(7)}`

    const device = await IoTDevice.create({
      name: data.name,
      type: data.type,
      macAddress: data.macAddress,
      location: data.location,
      resourceId: data.resourceId,
      mqttDeviceId,
      status: 'offline',
    })

    await IoTLog.create({
      deviceId: device.id,
      logType: 'system',
      message: 'Device registered',
    })

    return device
  }

  /**
   * Update device
   */
  async updateDevice(id: number, data: any) {
    const device = await IoTDevice.findOrFail(id)
    device.merge(data)
    await device.save()

    await IoTLog.create({
      deviceId: device.id,
      logType: 'system',
      message: 'Device updated',
    })

    return device
  }

  /**
   * Delete device
   */
  async deleteDevice(id: number) {
    const device = await IoTDevice.findOrFail(id)
    await device.delete()
  }

  /**
   * Send command to device
   */
  async sendCommand(deviceId: number, command: string, payload: any = {}) {
    const device = await IoTDevice.findOrFail(deviceId)

    if (!this.mqttClient) {
      throw new Error('MQTT client not initialized')
    }

    const topic = `${this.topicPrefix}/devices/${device.mqttDeviceId}/commands`
    const message = JSON.stringify({ command, payload, timestamp: Date.now() })

    return new Promise((resolve, reject) => {
      this.mqttClient!.publish(topic, message, (error) => {
        if (error) {
          reject(error)
        } else {
          IoTLog.create({
            deviceId: device.id,
            logType: 'command',
            message: `Command sent: ${command}`,
            data: message,
          })
          resolve({ success: true, command, deviceId })
        }
      })
    })
  }

  /**
   * Get device status
   */
  async getDeviceStatus(id: number) {
    const device = await IoTDevice.findOrFail(id)
    return {
      id: device.id,
      name: device.name,
      status: device.status,
      lastSeenAt: device.lastSeenAt,
    }
  }

  /**
   * Get device telemetry
   */
  async getDeviceTelemetry(
    deviceId: number,
    options: { startDate?: string; endDate?: string; page: number; limit: number }
  ) {
    const query = IoTTelemetry.query().where('device_id', deviceId).orderBy('created_at', 'desc')

    if (options.startDate) {
      query.where('created_at', '>=', options.startDate)
    }

    if (options.endDate) {
      query.where('created_at', '<=', options.endDate)
    }

    return await query.paginate(options.page, options.limit)
  }

  /**
   * Control door lock
   */
  async controlDoorLock(deviceId: number, action: 'lock' | 'unlock') {
    const device = await IoTDevice.findOrFail(deviceId)

    if (device.type !== 'door_lock' && device.type !== 'smart_lock') {
      throw new Error('Device is not a door lock')
    }

    return await this.sendCommand(deviceId, action, {})
  }

  /**
   * Get device logs
   */
  async getDeviceLogs(
    deviceId: number,
    options: { page: number; limit: number; logType?: string }
  ) {
    const query = IoTLog.query().where('device_id', deviceId).orderBy('created_at', 'desc')

    if (options.logType) {
      query.where('log_type', options.logType)
    }

    return await query.paginate(options.page, options.limit)
  }

  /**
   * Get devices by resource
   */
  async getDevicesByResource(resourceId: number) {
    return await IoTDevice.query().where('resource_id', resourceId)
  }

  /**
   * Test device connectivity
   */
  async testDeviceConnectivity(deviceId: number) {
    try {
      await this.sendCommand(deviceId, 'ping', {})
      return { connected: true, message: 'Ping command sent' }
    } catch (error) {
      return { connected: false, message: error.message }
    }
  }

  /**
   * Close MQTT connection
   */
  disconnect() {
    if (this.mqttClient) {
      this.mqttClient.end()
    }
  }
}
