#!/usr/bin/env node

import { Ignitor, prettyPrintError } from '@adonisjs/core'

/**
 * URL to the application root
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in production
 * when using the "node" binary.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
  })
  .testRunner()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
