import mqtt from 'mqtt'
import iotConfig from '#config/iot'
import IotDevice from '#models/iot_device'

export default class IotService {
  private client: mqtt.MqttClient | null = null
  private isConnected: boolean = false

  /**
   * Connect to MQTT broker
   */
  connect() {
    if (this.isConnected || this.client) {
      return
    }
    this.client = mqtt.connect(iotConfig.mqtt.brokerUrl, {
      username: iotConfig.mqtt.username,
      password: iotConfig.mqtt.password,
      clientId: iotConfig.mqtt.clientId,
    })

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker')
      this.isConnected = true
      this.subscribeToTopics()
    })

    this.client.on('message', async (topic, message) => {
      await this.handleMessage(topic, message.toString())
    })

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error)
    })
  }

  /**
   * Subscribe to MQTT topics
   */
  private subscribeToTopics() {
    if (!this.client) return

    this.client.subscribe(iotConfig.topics.status)
    this.client.subscribe(iotConfig.topics.events)
    console.log('Subscribed to IoT topics')
  }

  /**
   * Handle incoming MQTT messages
   */
  private async handleMessage(topic: string, message: string) {
    try {
      const data = JSON.parse(message)

      // Extract device ID from topic
      const deviceId = this.extractDeviceId(topic)

      if (topic.includes('/status')) {
        await this.updateDeviceStatus(deviceId, data)
      } else if (topic.includes('/events')) {
        await this.handleDeviceEvent(deviceId, data)
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error)
    }
  }

  /**
   * Extract device ID from MQTT topic
   */
  private extractDeviceId(topic: string): string {
    const parts = topic.split('/')
    return parts[2] // Assuming format: kbeen/devices/{deviceId}/...
  }

  /**
   * Update device status
   */
  private async updateDeviceStatus(deviceId: string, data: any) {
    const device = await IotDevice.query()
      .where('deviceId', deviceId)
      .first()

    if (device) {
      device.status = data.status || 'online'
      device.lastSeenAt = new Date()
      await device.save()
    }
  }

  /**
   * Handle device event
   */
  private async handleDeviceEvent(deviceId: string, data: any) {
    // TODO: Implement event handling logic
    console.log(`Device ${deviceId} event:`, data)
  }

  /**
   * Send command to device
   */
  async sendCommand(deviceId: string, command: string, payload: any = {}) {
    if (!this.isConnected) {
      this.connect()
      // Wait for connection
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    
    if (!this.client) {
      throw new Error('MQTT client not connected')
    }

    const topic = `kbeen/devices/${deviceId}/commands`
    const message = JSON.stringify({
      command,
      payload,
      timestamp: new Date().toISOString(),
    })

    return new Promise((resolve, reject) => {
      this.client!.publish(topic, message, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
      this.isConnected = false
    }
  }
}
