import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";

// Get the MessageContent component which handles rendering messages
const MessageContent = findByProps("getMessageContent");

let unpatch: () => void;

export const onLoad = () => {
  // Default storage flag
  if (storage.showIgnoredEmbeds === undefined) storage.showIgnoredEmbeds = true;

  unpatch = after("getMessageContent", MessageContent, (args, ret) => {
    const message = args?.[0];

    // Check if message is from ignored user
    if (message?.state?.isBlocked && storage.showIgnoredEmbeds) {
      // Force showing embeds
      message.message?.blocked = false;
      message.message?.state?.isBlocked = false;
      message.isBlocked = false;
    }

    return ret;
  });
};

export const onUnload = () => {
  unpatch?.();
};

export const settings = Settings;
