export default class IotListener {
  async onDeviceConnected(device: any) {
    console.log('Device connected:', device.deviceId)
    // TODO: Update device status, send notification
  }

  async onDeviceDisconnected(device: any) {
    console.log('Device disconnected:', device.deviceId)
    // TODO: Update device status, check for issues
  }

  async onDeviceError(device: any) {
    console.log('Device error:', device.deviceId)
    // TODO: Log error, send alert to administrators
  }
}
