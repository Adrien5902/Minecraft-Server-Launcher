import { useState } from "react";
import Input from "../Input";
import Button from "../Input/Button";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { wrongInputAnimationKeyframes } from "../Input/wrong-input-animation";

interface ServerResolvable{
    name: string,
    loader: string
}

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
    const [data, setData] = useState<ServerResolvable>({name: null, loader: null});
    const [everythingDone, setEverythingDone] = useState(false);

    const findUnsubmitted = (data) => Object.keys(data).find(key => data[key] === null || data[key] === "")

    function set(dataKey: keyof ServerResolvable, value: any) {        
        let newData = {
            ...data,
            [dataKey]: value,
        }

        setData(newData);
        setEverythingDone(!findUnsubmitted(newData))
    }

    function handleSelectLoader(loaderId: string) {
        set("loader", loaderId);
    }

    function handleSubmit(){
        const unsubmittedInputId = findUnsubmitted(data)
        document.getElementById(unsubmittedInputId).animate(wrongInputAnimationKeyframes, {duration: 500})
    }

    return (
        <div>
        <Input
            type="text"
            label="Nom du serveur :"
            properties={{ placeholder: "Donnez un nom au serveur..." }}
            value={data.name ?? ""}
            onChange={v => {set("name", v)}}
            id="name"
            className="input-box"
        />

        <h2>Type de serveur :</h2>
        <div id="loader" className="input-box">
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
            <Loader
                id="paper"
                name="Paper MC"
                imgSrc="/assets/papermc.svg"
                desc="Spigot mais better"
                isSelected={data.loader === "paper"}
                onSelectLoader={handleSelectLoader}
            />
        </div>
        <br />
        
        <Button 
            fancy={true}
            text={<>
                <FontAwesomeIcon icon={everythingDone ? faRocket : faXmark}/>
                {everythingDone ? <span> Créer le serveur</span> : <span> Veuillez remplir tous les champs</span>}
            </>}
            color={everythingDone ? "var(--accent)" : "red"}
            onClick={handleSubmit}
        ></Button>
        </div>
    );
}

export default CreateServer;