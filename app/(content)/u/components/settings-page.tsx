'use client'

import { toast } from "sonner";

export default function SettingsTab() {
    
    return (
        <div className="bg-secondaryBack rounded-lg p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Full settings page coming soon. For now, use the Edit Profile button above.
                </p>
            </div>

            <div className="space-y-4">
                <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                    <h3 className="font-semibold mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => toast.info("Feature coming soon")}
                            className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => toast.info("Feature coming soon")}
                            className="w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                            Privacy Settings
                        </button>
                        <button
                            onClick={() => toast.info("Feature coming soon")}
                            className="w-full text-left px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}