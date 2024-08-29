import React, { memo, useCallback, useEffect, useState } from "react";
import { useGlobals, type API } from "storybook/internal/manager-api";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";
import { ADDON_ID, KEY, TOOL_ID } from "../constants";
import { CategoryIcon } from "@storybook/icons";
import { action } from "@storybook/addon-actions";
import { styled } from "storybook/internal/theming";
import { on } from "events";

const onClick = (_: any, v: any) => {
  const newPath = (window.location.pathname + "v").replace(
    /\/[^/]+$/,
    `/${v.path}`,
  );
  console.log(
    "Navigating to:",
    window.location.origin + newPath + "/" + window.location.search,
  );
};

export const Tool = memo(function MyAddonSelector({ api }: { api: API }) {
  const [globals, updateGlobals, storyGlobals] = useGlobals();
  const [versions, setVersions] = useState([]);
  const path = "0.6.0";
  const title = versions.find((v) => v.path === path)?.title;

  useEffect(() => {
    console.log("Fetching versions.json...");
    fetch("/../versions.json")
      .then((response) => {
        console.log("Response received:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Data parsed:", data);
        setVersions(data.map((x: any) => ({ ...x, onClick })));
      })
      .catch((error) => {
        setVersions([
          {
            path: "0.6.0",
            title: "Release 0.6.0 (latest)",
            onClick,
          },
          {
            path: "0.5.1",
            title: "Release 0.5.1",
            onClick,
          },
        ]);
        console.error("Error loading versions:", error);
      });
  }, []);

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
    console.log({ event });
    const selectedVersion = event.target.value;
    window.location.href = `/${selectedVersion}/index.html`;
  };

  console.log({ location: window.location });

  return (
    <div style={{ padding: "10px" }}>
      <WithTooltip
        placement="bottom"
        trigger="click"
        withArrows={false}
        tooltip={<TooltipLinkList links={versions ?? []} />}
      >
        <IconButton
          key={TOOL_ID}
          active={isActive}
          disabled={isLocked}
          title="Enable my addon"
        >
          <CategoryIcon style={{ color: "#54b3a6" }} />
          {title}
        </IconButton>
      </WithTooltip>
    </div>
  );
});

const Button = styled.button({});
