import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import { SLACK_CLIENT_URL } from "../lib/mem-slack";

export function Slack() {
  return (
    <ConsoleLayout defaultSidebar="apps" bleed>
      <VideoStage
        videoId="1217019861"
        title="MEM Healthcare — Slack"
        immersive
        contentClassName="h-full"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-transparent" />
        <div className="relative h-full pt-3 pr-3 pb-3 pl-sidebar">
          <iframe
            src={SLACK_CLIENT_URL}
            title="Slack"
            className="h-full w-full rounded-2xl border border-white/60 bg-white shadow-lg"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}
