module.exports = {
    packagerConfig: {
      asar: false,
      icon: "path/to/app-icon.ico",
      asarUnpack: [
        ".gitignore",
        "*.config.js",
        ".env",
        "public/",
        "**/src/!(load.js)"
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
      // Add other makers here for macOS and Linux if needed
    ],
/*     publishers: [
      // Configuration options for each publisher you want to use
      // For example, for GitHub:
      {
        name: "@electron-forge/publisher-github",
        config: {
          repository: {
            owner: "your_github_username",
            name: "your_github_repository",
          },
          draft: true, // Change to false to automatically publish
        },
      },
      // Add other publishers here for other platforms if needed
    ], */
  };
  