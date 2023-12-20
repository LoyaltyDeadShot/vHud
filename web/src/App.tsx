import React, { useState, useEffect } from "react";
import "./App.css";
import { debugData } from "./utils/debugData";
import { fetchNui } from "./utils/fetchNui";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { isEnvBrowser } from "./utils/misc";
import TopRight from "./components/TopRight";
import Status from "./components/Status";
import CarHud from "./components/CarHud";
import Settings from "./components/Settings";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

interface SettingsInterface {
  hudMode: number | string;
  statusBarMode: number | string;
  transparency: any;
  measurementSystem: string;
}
interface Config {
  ["Debug"]: boolean;
  ["Server Name"]: string;
  ["Footer"]: string;
  ["Framework"]: string;
  ["Framework Options"]: { ["Status"]: boolean };
  ["Player Slots"]: string | number;
  ["Default Settings"]: Settings;
}

const App: React.FC = () => {
  const [isInVehicle, setIsInVehicle] = useState(false);
  const [visible, setVisible] = useState(true);
  const [settingsVisiblity, setSettingsVisibility] = useState(false);
  const [config, setConfig] = useState<Config>({
    ["Debug"]: true,
    ["Server Name"]: "SERVER NAME",
    ["Footer"]: "DISCORD.GG/SERVER_LINK",
    ["Framework"]: "standalone",
    ["Framework Options"]: {
      ["Status"]: false,
    },
    ["Player Slots"]: 200,
    ["Default Settings"]: {
      hudMode: 1,
      statusBarMode: 1,
      transparency: 100,
      measurementSystem: "MPH",
    },
  });
  const [globalSettings, setGlobalSettings] = useState<SettingsInterface>({
    hudMode: 3,
    statusBarMode: 1,
    transparency: 100,
    measurementSystem: "MPH",
  });

  useNuiEvent<boolean>("setVisible", setVisible);

  useNuiEvent<Settings>("nui:state:globalsettings", (data) => {
    if (!data) {
      return console.log(
        "[nui:state:globalsettings] called but the first param is null, returning."
      );
    }

    setGlobalSettings(data);
  });

  useNuiEvent("nui:state:settingsui", (data) => {
    if (!!data) {
      setSettingsVisibility(data);
      return;
    }
    setSettingsVisibility(!settingsVisiblity);
  });

  useNuiEvent("nui:state:isinveh", (isinveh) => {
    setIsInVehicle(isinveh);
  });

  useNuiEvent("nui:state:scriptConfig", setConfig);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible);
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  return (
    <>
      <div className={`${visible ? "visible" : "invisible"}`}>
        <TopRight userSettings={globalSettings} scriptConfig={config} />
        <Status userSettings={globalSettings} scriptConfig={config} />
        {!!isInVehicle && (
          <CarHud userSettings={globalSettings} scriptConfig={config} />
        )}
      </div>
      {!!settingsVisiblity && (
        <Settings userSettings={globalSettings} scriptConfig={config} />
      )}
    </>
  );
};

export default App;
