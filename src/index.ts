import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";
import { registerSettings, unregisterSettings } from "@vendetta/settings";

const MessageComponent = findByProps("MessageContent")?.default;
let unpatch: () => void;

function shouldShowEmbed(message: any): boolean {
  if (!storage.showIgnoredEmbeds) return false;
  return message?.isBlocked === true && message?.embeds?.length > 0;
}

function InjectEmbedFix() {
  unpatch = after("type", MessageComponent, ([props]: any, res: any) => {
    if (shouldShowEmbed(props?.message)) {
      const embeds = props.message.embeds;
      res.props.children.push(
        React.createElement(
          "View",
          { style: { marginTop: 6 } },
          embeds.map((embed: any, i: number) =>
            React.createElement("Text", { style: { color: "gray" }, key: i }, embed?.url || "[embed]")
          )
        )
      );
    }
    return res;
  });
}

export const onLoad = () => {
  storage.showIgnoredEmbeds ??= true;
  InjectEmbedFix();
  registerSettings("ShowIgnoredEmbeds", "Show Ignored Embeds", () => React.createElement(Settings));
};

export const onUnload = () => {
  unpatch?.();
  unregisterSettings("ShowIgnoredEmbeds");
};
