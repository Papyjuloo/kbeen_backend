import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'

export const plugins = [
  assert(),
  apiClient({
    baseURL: `http://${process.env.HOST}:${process.env.PORT}`,
  }),
  pluginAdonisJS(app),
]
