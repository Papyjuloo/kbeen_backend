import env from '#start/env'

export default {
  mqtt: {
    brokerUrl: env.get('MQTT_BROKER_URL'),
    username: env.get('MQTT_USERNAME'),
    password: env.get('MQTT_PASSWORD'),
    clientId: env.get('MQTT_CLIENT_ID'),
  },
  topics: {
    commands: 'kbeen/devices/+/commands',
    status: 'kbeen/devices/+/status',
    events: 'kbeen/devices/+/events',
  },
}
