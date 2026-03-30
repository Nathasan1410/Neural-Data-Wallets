// Global types for vitest
import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'

declare global {
  namespace Vi {
    interface ExpectStatic extends expect.ExpectStatic {}
  }
}
