/**
 * @name ShowIgnoredEmbeds
 * @description Display messages with embeds from users you've ignored.
 * @version 1.0.0
 * @author You
 */

import { React } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findByName } from "@vendetta/metro";
import { findInReactTree } from "@vendetta/utils";
import { storage } from "@vendetta/plugin"; // For settings
import { SwitchRow } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";

// Root component: settings toggle
export const Settings = () => {
  const [enabled, setEnabled] = React.useState<boolean>(storage.showIgnoredEmbeds ?? true);

  const onToggle = (val: boolean) => {
    storage.showIgnoredEmbeds = val;
    setEnabled(val);
    showToast(`Show Ignored Embeds ${val ? "Enabled" : "Disabled"}`, { type: "info" });
  };

  return (
    <SwitchRow
      value={enabled}
      onValueChange={onToggle}
      label="Show ignored user embeds"
      description="Reveal images/videos posted by users you've ignored."
    />
  );
};

// Run on plugin load
export const onLoad = () => {
  const Message = findByName("Message", false);
  if (!Message) {
    console.error("[ShowIgnored] Failed to find Message component.");
    return;
  }

  after("type", Message, (args, res) => {
    if (!storage.showIgnoredEmbeds) return res;

    // If message is from ignored user but has embeds, display them
    const msg = args[0];
    if (msg.ignored && Array.isArray(msg.embeds) && msg.embeds.length > 0) {
      const embedSection = findInReactTree(res, (r) =>
        r?.type?.displayName === "MessageContent" && Array.isArray(r.props.children)
      );
      if (embedSection) {
        msg.embeds.forEach((e: any) => {
          embedSection.props.children.push(
            React.createElement(
              findByName("EmbedView") || "View",
              { key: `show-ignored-${e.id}`, embed: e, style: { marginTop: 8 } },
              null
            )
          );
        });
      }
    }

    return res;
  });
};

export const onUnload = () => {
  // Vendetta unpatches automatically between reloads—no explicit unpatch needed.
};
