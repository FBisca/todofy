import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export function cleanDatabase() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, '../../../' + process.env.TASKS_FILE_PATH)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
