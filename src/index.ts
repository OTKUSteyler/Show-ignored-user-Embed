import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

// Get MessageContent, which renders each message in chat
const MessageContent = findByProps("getMessageContent");

let unpatch: () => void;

export const onLoad = () => {
  if (storage.showIgnoredEmbeds === undefined) storage.showIgnoredEmbeds = true;

  unpatch = after("getMessageContent", MessageContent, (args, ret) => {
    const message = args?.[0]?.message;

    if (args?.[0]?.isBlocked && storage.showIgnoredEmbeds && message) {
      // Force showing embeds
      message.blocked = false;
      args[0].isBlocked = false;
    }

    return ret;
  });
};

export const onUnload = () => {
  unpatch?.();
};

export const settings = Settings;
