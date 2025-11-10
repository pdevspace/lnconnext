import Image from 'next/image'
import Link from 'next/link'

import { Facebook, Heart, MessageCircle, Send, Twitter } from 'lucide-react'

export default function InfoPage() {
	return (
		// <div className=""></div>
		<div className="bg-gray-50 pt-20 h-screen overflow-y-auto">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						About LNConnext
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						LNConnext คือ เว็บ Event Tracker
						ที่รวบรวมงานและกิจกรรมที่เกี่ยวข้องกับ Bitcoin ไว้ในที่เดียว
						เพื่อให้คุณไม่พลาดทุกโอกาสพบปะ พูดคุย และเรียนรู้เกี่ยวกับ Bitcoin v
					</p>
				</div>

				{/* Contact & Support Section */}
				<div className="bg-white rounded-lg shadow-md p-8 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Contact & Support
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-3">
								Get in Touch
							</h3>
							<p className="text-gray-600 mb-4">
								เราอยากชวนทุกคนมาช่วยกันทำให้เว็บไซต์นี้มีประโยชน์ ใช้งานง่าย
								และข้อมูลครบถ้วนมากที่สุด
							</p>
							<p className="text-gray-600f mb-4">
								ไม่ว่าคุณจะเป็น developer, designer, หรือแค่ผู้ใช้งานทั่วไป
								ก็สามารถช่วยได้
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-3">
								How You Can Help
							</h3>
							<ul className="text-gray-600 space-y-2">
								<li>• แนะนำปรับปรุง UX/UI, ดีไซน์ และ การใช้คำ (wording)</li>
								<li>• แจ้งข้อผิดพลาดของ Event</li>
								<li>• เสนอ Event ใหม่ๆ</li>
								<li>• เสนอ Feature ใหม่ที่คุณอยากให้มี</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Social Media Section */}
				<div className="bg-white rounded-lg shadow-md p-8 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Follow Us
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Link
							href="https://www.facebook.com/profile.php?id=61579068644495"
							target="_blank"
							rel="noopener noreferrer"
							className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors"
						>
							<Facebook className="h-8 w-8 text-blue-600 mb-2" />
							<span className="text-sm font-medium text-gray-700">
								Facebook
							</span>
						</Link>

						<div className="flex flex-col items-center p-4 rounded-lg opacity-50">
							<MessageCircle className="h-8 w-8 text-green-600 mb-2" />
							<span className="text-sm font-medium text-gray-700">Line</span>
						</div>

						<div className="flex flex-col items-center p-4 rounded-lg opacity-50">
							<Twitter className="h-8 w-8 text-blue-400 mb-2" />
							<span className="text-sm font-medium text-gray-700">Twitter</span>
						</div>

						<div className="flex flex-col items-center p-4 rounded-lg opacity-50">
							<Send className="h-8 w-8 text-blue-500 mb-2" />
							<span className="text-sm font-medium text-gray-700">
								Telegram
							</span>
						</div>
					</div>
				</div>

				{/* Donation Section */}
				<div className="bg-white rounded-lg shadow-md p-8 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<Heart className="h-6 w-6 text-red-500" />
						Support LNConnext
					</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-4">
								Donate with Bitcoin Lightning Network
							</h3>
							<p className="text-gray-600 mb-4">
								Help us keep LNConnext running and improving by sending Bitcoin
								via Lightning Network
							</p>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-sm font-medium text-gray-800 mb-2">
									Lightning Address:
								</p>
								<p className="font-mono text-blue-600 break-all">
									lnconnext@lnconnext.vercel.app
								</p>
							</div>
						</div>
						<div className="flex flex-col items-center">
							<h3 className="text-lg font-medium text-gray-800 mb-4">
								QR Code
							</h3>
							<div className="bg-white p-4 rounded-lg border">
								<Image
									src="/images/LNURL.png"
									alt="Lightning Network QR Code"
									width={200}
									height={200}
									className="rounded"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* GitHub Section */}
				<div className="bg-white rounded-lg shadow-md p-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Open Source
					</h2>
					<div className="text-center">
						<p className="text-gray-600 mb-4">
							LNConnext is open source! Contribute to the project on GitHub.
						</p>
						<Link
							href="https://github.com/pdevspace/lnconnext"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
						>
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							View on GitHub
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
