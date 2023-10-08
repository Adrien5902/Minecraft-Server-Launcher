module.exports = {
    packagerConfig: {
        asar: false,
        icon: "path/to/app-icon.ico",
        ignore: [
            ".gitignore",
            ".config.js",
            ".env",
            "public",
            "src",
        ],
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ["win32"],
            config: {
                name: "MinecraftServerLauncher",
                description: "A server launcher for Minecraft made by Adrien5902"
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'Adrien5902',
                    name: 'Minecraft-Server-Launcher'
                },
                prerelease: true,
                draft: true
            }
        }
    ]
};