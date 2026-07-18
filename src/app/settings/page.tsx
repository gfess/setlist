export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-xl font-bold">Settings</h1>
      <div className="flex flex-col gap-3">
        {["Account", "Privacy", "Notifications", "Linked services (Spotify)"].map((section) => (
          <div key={section} className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
            {section} — coming soon
          </div>
        ))}
      </div>
    </div>
  );
}
