"use client"

import { useSettings } from "@/features/settings/hooks/useSettings"
import { ProfileSection } from "@/features/settings/components/ProfileSection"
import { ApiKeysSection } from "@/features/settings/components/ApiKeysSection"
import { SigningSecretSection } from "@/features/settings/components/SigningSecretSection"
import { DangerZoneSection } from "@/features/settings/components/DangerZoneSection"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

export const SettingsPage = () => {
  const { profile, signingSecret, loading, error, refetchProfile } =
    useSettings()

  if (loading) return <LoadingSpinner />

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Settings"
        description="Manage your profile, API keys, and preferences."
      />

      <div className="space-y-4">
        {profile && (
          <ProfileSection profile={profile} onSaved={refetchProfile} />
        )}

        <ApiKeysSection />

        {signingSecret && (
          <SigningSecretSection
            preview={signingSecret.preview}
            onRegenerated={refetchProfile}
          />
        )}

        <DangerZoneSection />
      </div>
    </div>
  )
}