import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { showSuccess, showError } from "@/lib/toast";

export function GitHubIntegration() {
  const { t } = useTranslation(["home", "common"]);
  const { settings, updateSettings } = useSettings();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectToGithub = async () => {
    if (!accessToken.trim()) return;
    setIsConnecting(true);
    try {
      const result = await updateSettings({
        githubAccessToken: {
          value: accessToken.trim(),
        },
      });
      if (result) {
        showSuccess(t("integrations.github.connected"));
        setAccessToken("");
      } else {
        showError(t("integrations.github.failedConnect"));
      }
    } catch (err: any) {
      showError(err.message || t("integrations.github.errorConnect"));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectFromGithub = async () => {
    setIsDisconnecting(true);
    try {
      const result = await updateSettings({
        githubAccessToken: undefined,
        githubUser: undefined,
      });
      if (result) {
        showSuccess(t("integrations.github.disconnected"));
      } else {
        showError(t("integrations.github.failedDisconnect"));
      }
    } catch (err: any) {
      showError(err.message || t("integrations.github.errorDisconnect"));
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isConnected = !!settings?.githubAccessToken;

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("integrations.github.title")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Connect your GitHub account to enable one-click deployments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="password"
            placeholder="GitHub Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleConnectToGithub}
            disabled={isConnecting || !accessToken.trim()}
            size="sm"
          >
            {isConnecting ? t("common:connecting") : t("common:connect")}
          </Button>
        </div>
        <p className="text-[10px] text-gray-400">
          You can create a token in your{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub settings
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("integrations.github.title")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("integrations.github.connected")}
        </p>
      </div>

      <Button
        onClick={handleDisconnectFromGithub}
        variant="destructive"
        size="sm"
        disabled={isDisconnecting}
        className="flex items-center gap-2"
      >
        {isDisconnecting
          ? t("common:disconnecting")
          : t("integrations.github.disconnect")}
        <Github className="h-4 w-4" />
      </Button>
    </div>
  );
}
