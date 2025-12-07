import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Health check', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('should return 200 with status ok', async ({ client }) => {
    const response = await client.get('/health')

    response.assertStatus(200)
    response.assertBodyContains({ status: 'ok' })
  })
})
