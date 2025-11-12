import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin(): ReturnType<typeof initializeApp> | null {
	// Check if already initialized
	if (getApps().length > 0) {
		return getApps()[0]
	}

	try {
		// Method 1: Use base64 encoded service account key
		if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
			// console.log('Initializing Firebase Admin with service account key...')
			const serviceAccount = JSON.parse(
				Buffer.from(
					process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
					'base64'
				).toString('utf-8')
			)

			// console.log(
			// 	'Service account parsed successfully, project ID:',
			// 	serviceAccount.project_id
			// )
			return initializeApp({
				credential: cert(serviceAccount),
			})
		}

		// Method 2: Use individual environment variables
		if (
			process.env.FIREBASE_ADMIN_PROJECT_ID &&
			process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
			process.env.FIREBASE_ADMIN_CLIENT_EMAIL
		) {
			return initializeApp({
				credential: cert({
					projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
					privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
						/\\n/g,
						'\n'
					),
					clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
				}),
			})
		}

		// No credentials found - return null instead of throwing
		console.warn(
			'⚠️  Firebase Admin credentials not found in environment variables. ' +
				'Authentication will not work. Please set either FIREBASE_SERVICE_ACCOUNT_KEY ' +
				'or FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY, and FIREBASE_ADMIN_CLIENT_EMAIL'
		)
		return null
	} catch (error) {
		console.error('Failed to initialize Firebase Admin:', error)
		return null
	}
}

// Initialize the app
let app: ReturnType<typeof initializeApp> | null = null
let adminAuth: ReturnType<typeof getAuth> | null = null

app = initializeFirebaseAdmin()
if (app) {
	adminAuth = getAuth(app)
} else {
	adminAuth = null
}

// Export admin auth instance
export { adminAuth }

/**
 * Verify Firebase ID Token
 * @param token - Firebase ID token from client
 * @returns Decoded token with user info or null if invalid
 */
export async function verifyIdToken(token: string) {
	try {
		if (!adminAuth) {
			console.error(
				'❌ Firebase Admin SDK not initialized. Cannot verify token. ' +
					'Please configure Firebase Admin credentials in environment variables.'
			)
			return null
		}

		const decodedToken = await adminAuth.verifyIdToken(token)

		return {
			uid: decodedToken.uid,
			email: decodedToken.email || '',
			emailVerified: decodedToken.email_verified || false,
		}
	} catch (error) {
		console.error('Token verification failed:', error)
		return null
	}
}

/**
 * Get user by UID
 * @param uid - Firebase user UID
 * @returns User record or null if not found
 */
export async function getUserByUid(uid: string) {
	try {
		if (!adminAuth) {
			console.error('Firebase Admin SDK not initialized')
			return null
		}

		const userRecord = await adminAuth.getUser(uid)
		return userRecord
	} catch (error) {
		console.error('Failed to get user by UID:', error)
		return null
	}
}
