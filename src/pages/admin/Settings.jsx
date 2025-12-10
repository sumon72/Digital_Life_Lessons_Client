
export default function Settings() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <div className="space-y-6 max-w-2xl">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input type="text" defaultValue="Digital Life Lessons" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <textarea rows={3} defaultValue="Share wisdom, preserve memories, grow together" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site URL</label>
              <input type="url" defaultValue="https://example.com" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Email Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <input type="email" defaultValue="admin@example.com" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" id="emailNotif" defaultChecked className="w-4 h-4" />
              <label htmlFor="emailNotif" className="text-sm font-medium">Enable email notifications for new lessons</label>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Content Moderation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Lesson Length (characters)</label>
              <input type="number" defaultValue={5000} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" id="autoModerate" defaultChecked className="w-4 h-4" />
              <label htmlFor="autoModerate" className="text-sm font-medium">Auto-approve lessons from verified users</label>
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" id="comments" defaultChecked className="w-4 h-4" />
              <label htmlFor="comments" className="text-sm font-medium">Allow user comments</label>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">API & Integrations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <div className="flex gap-2">
                <input type="password" defaultValue="sk_live_xxxxxxxxxxxxx" className="flex-1 px-4 py-2 border rounded-lg" />
                <button className="btn btn-outline btn-sm">Regenerate</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn btn-primary">Save Settings</button>
          <button className="btn btn-outline">Reset</button>
        </div>
      </div>
    </>
  )
}
