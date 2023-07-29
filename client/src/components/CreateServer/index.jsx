import { useState } from "react";
import Input from "../Input";
import "./style.css";

function Loader({ id, name, imgSrc, desc, isSelected, onSelectLoader }) {
  return (
    <div
      className={`loader ${isSelected ? "selected" : ""}`}
      id={"loader-" + id}
      onClick={() => onSelectLoader(id)}
    >
      <img src={imgSrc} alt="" />
      <h3>{name}</h3>
      <p>{desc}</p>
    </div>
  );
}

function CreateServer() {
  const [data, setData] = useState({ serverName: "test 2", loader: "" });

  function set(dataKey, value) {
    setData((prevData) => ({
      ...prevData,
      [dataKey]: value,
    }));
  }

  function handleSelectLoader(loaderId) {
    set("loader", loaderId);
  }

  return (
    <div>
      <Input
        type="text"
        label="Nom du serveur"
        properties={{ placeholder: "Donnez un nom au serveur..." }}
        autoUpdate={true}
        value={data.serverName ?? ""}
      />

      <div id="choose-loader">
        <h2>Type de serveur :</h2>
        <Loader
            id="vanilla"
            name="Vanilla"
            imgSrc="/assets/mc-icon.webp"
            desc="Minecraft sans mods"
            isSelected={data.loader === "vanilla"}
            onSelectLoader={handleSelectLoader}
        />
        <Loader
            id="forge"
            name="Forge"
            imgSrc="/assets/curseforge.svg"
            desc="Minecraft avec des mods"
            isSelected={data.loader === "forge"}
            onSelectLoader={handleSelectLoader}
        />
        <Loader
            id="spigot"
            name="Spigot/Bukkit"
            imgSrc="/assets/bukkit.png"
            desc="Minecraft avec des plugins"
            isSelected={data.loader === "spigot"}
            onSelectLoader={handleSelectLoader}
        />
      </div>
    </div>
  );
}

export default CreateServer;
