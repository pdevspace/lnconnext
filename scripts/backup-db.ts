import { execSync } from 'child_process'
import { format } from 'date-fns'

/**
 * Backup MongoDB database
 * Usage: tsx scripts/backup-db.ts
 */
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL environment variable is not set')
	process.exit(1)
}

const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
const backupDir = `backup/${timestamp}`

try {
	console.log('📦 Starting database backup...')
	console.log(`📁 Backup directory: ${backupDir}`)

	execSync(`mongodump --uri="${DATABASE_URL}" --out=${backupDir}`, {
		stdio: 'inherit',
	})

	console.log(`✅ Backup completed successfully: ${backupDir}`)
	console.log(
		`💡 To restore: mongorestore --uri="${DATABASE_URL}" ${backupDir}`
	)
} catch (error) {
	console.error('❌ Backup failed:', error)
	process.exit(1)
}
