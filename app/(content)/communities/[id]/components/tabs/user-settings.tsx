'use client'

import { toast } from "sonner"

export default function UserSettingsTab({ isAdmin }: { isAdmin: boolean }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <button onClick={() => toast.info('Leave Group coming soon!')} type="button" className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Leave Community</button>
            {isAdmin && <button onClick={() => toast.info('Delete Account coming soon!')} type="button" className="ml-4 px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">Delete Community</button>}
        </div>
    )
}