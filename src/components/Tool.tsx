import React, { memo, useCallback, useEffect } from "react";
import { useGlobals, type API } from "storybook/internal/manager-api";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";
import { ADDON_ID, KEY, TOOL_ID } from "../constants";
import { CategoryIcon } from "@storybook/icons";
import { styled } from "storybook/internal/theming";

export const links = [
  { id: "1", title: "Versión 1.1.0", href: "/1.1.0/" },
  { id: "2", title: "Versión 1.0.0", href: "/1.0.0/" },
];

export const Tool = memo(function MyAddonSelector({ api }: { api: API }) {
  const [globals, updateGlobals, storyGlobals] = useGlobals();

  const isLocked = KEY in storyGlobals;
  const isActive = !!globals[KEY];

  const toggle = useCallback(() => {
    updateGlobals({
      [KEY]: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: "Toggle Measure [O]",
      defaultShortcut: ["O"],
      actionName: "outline",
      showInMenu: false,
      action: toggle,
    });
  }, [toggle, api]);

  const handleChange = (event) => {
    const selectedVersion = event.target.value;
    window.location.href = `/${selectedVersion}/index.html`;
  };

  return (
    <div style={{ padding: "10px" }}>
      <WithTooltip
        placement="bottom"
        trigger="click"
        withArrows={false}
        tooltip={<TooltipLinkList links={links} />}
      >
        <IconButton
          key={TOOL_ID}
          active={isActive}
          disabled={isLocked}
          title="Enable my addon"
          onClick={toggle}
        >
          <CategoryIcon style={{ color: "#54b3a6" }} />
          version 1.0.0
        </IconButton>
      </WithTooltip>
    </div>
  );
});

const Button = styled.button({});
