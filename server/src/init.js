import {curseForgeAPIKey, serverDir} from "../config.js"
import {CurseForgeClient} from 'curseforge-api'
import fetch from "node-fetch"
import fs from 'fs'
import { errors } from "./errors.js"

import DiscordOauth2 from "discord-oauth2";
export const oauth = new DiscordOauth2();

if(!fs.existsSync(serverDir)) throw errors.serverDirNotFound

export const curseforgeClient = new CurseForgeClient(curseForgeAPIKey, {fetch})

export const minecraftVersions = await curseforgeClient.getMinecraftVersions()
export const latestMinecraftVersion = minecraftVersions[0]

export const minecraftModLoaders = await curseforgeClient.getMinecraftModLoaders()
export const recommendedLatestMinecraftModLoader = minecraftModLoaders.find(loader => loader.recommended && loader.gameVersion == latestMinecraftVersion.versionString)
export const latestMinecraftModLoader = minecraftModLoaders.find(loader => loader.latest && loader.gameVersion == latestMinecraftVersion.versionString)