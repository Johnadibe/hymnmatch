/**
 * EAS prebuildCommand must be a single executable (no shell &&).
 * Runs Expo prebuild, then patches Android splash to full-bleed.
 */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

execSync('npx expo prebuild --platform android', { cwd: appRoot, stdio: 'inherit' })
execSync('node scripts/patch-android-splash.mjs', { cwd: appRoot, stdio: 'inherit' })
