import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { General } from "@vendetta/ui/components";

const { View } = ReactNative;
const { FormRow, FormSwitch } = General;

export default function Settings() {
  const [enabled, setEnabled] = React.useState(storage.showIgnoredEmbeds ?? true);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    storage.showIgnoredEmbeds = newValue;
  };

  return (
    <View style={{ padding: 16 }}>
      <FormRow
        label="Show ignored user media"
        subLabel="Show embeds (images, videos, etc) from ignored users"
        trailing={
          <FormSwitch
            value={enabled}
            onValueChange={toggle}
          />
        }
      />
    </View>
  );
}
