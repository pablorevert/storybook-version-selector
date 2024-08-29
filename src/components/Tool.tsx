import React, { memo, useCallback, useEffect, useState } from "react";
import { useGlobals, type API } from "storybook/internal/manager-api";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";
import { KEY, TOOL_ID } from "../constants";
import { CategoryIcon } from "@storybook/icons";
import { styled } from "storybook/internal/theming";

const onClick = (_: any, v: any) => {
  const newPath = (window.location.pathname + "v").replace(
    /\/[^/]+$/,
    `/${v.path}`,
  );
  window.location.href =
    window.location.origin + newPath + window.location.search;
};

export const Tool = memo(function MyAddonSelector({ api }: { api: API }) {
  const [, , storyGlobals] = useGlobals();
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
          active={false}
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
