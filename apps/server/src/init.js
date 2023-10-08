import {curseForgeAPIKey, serverDir} from "../config.js"
import {CurseForgeClient} from 'curseforge-api'
import fetch from "node-fetch"
import fs from 'fs'
import https from 'https'
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

/**
 * @param {{}} obj 
 * @param {(value, key : string, inputObj) => any} callback 
 * @returns {{}}
 */
export default function mapObject(obj, callback) {
    return Object.keys(obj).reduce((result, key) => {
        const res = callback(obj[key], key, obj)
        if(res !== undefined) result[key] = res;
        return result;
    }, {});
}

/**
 * @param {string} text 
 */
export function formatSearch(text){
    return text.toLowerCase().replaceAll(" ", "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export const downloadFile = (url, destination, options) => {
    return new Promise((resolve, reject) => {
      https.get(url, options, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Request failed with status code ${response.statusCode}`));
          return;
        }
  
        const fileStream = fs.createWriteStream(destination);
        response.pipe(fileStream);
  
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
  
        fileStream.on('error', (err) => {
          fs.unlinkSync(destination);
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  };