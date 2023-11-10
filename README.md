# Snapfolio - VSCode Extension

## Description

Snapfolio is a Visual Studio Code extension that seamlessly integrates with Notion, allowing you to enhance your workflow by customizing code snippets, adding text and code to Notion pages, creating new Notion pages, and exploring your content.

## Features

- **Authenticate with Notion:** Connect your Notion account to Snapfolio.
- **Customize Snippets:** Tailor your code snippets with themes, font size, and background color.
- **Add Text and Code to Notion Pages:** Enhance your Notion pages directly from VSCode.
- **Create Notion Pages:** Quickly create new Notion pages with a specified title.
- **Explorer View:** Navigate and manage your Snapfolio content directly within VSCode.

## Requirements

- VSCode version 1.84.0 or higher.
- Notion account.

## Installation

1. Launch VS Code.
2. Go to Extensions.
3. Search for "Snapfolio" and click Install.

## Local Installation

1. Clone the repository.

    ```bash
    git clone https://github.com/Jasleen8801/snapfolio.git
    ```

2. Clone the other repository.

    ```bash
    git clone https://github.com/Jasleen8801/Snapfolio-API.git
    ```
  
3. Setup the backend repo as given in instructions [here](https://github.com/Jasleen8801/Snapfolio-API/blob/main/README.md).

4. Open the project in VSCode.

5. Install dependencies.

    ```bash
    npm install
    ```
  
6. Build the project.

    ```bash
    npm run build
    ```

7. Run the project.

    ```bash
    npm run watch
    ```

8. Open a new VSCode window and open the project.

9. Create a .env file in the root directory of the project and add the following:

    ```bash
    AUTHORIZATION_URL=<YOUR_AUTH_URL_AS_IN_BACKEND_API>
    ```

10. Press `F5` to launch the extension in a new window.

11. Authenticate Snapfolio using the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Snapfolio: Authenticate."

**Note**: The backend API assumes to be run on port 3000. If you want to change the port, make sure to change the port in the backend API as well. 

## Getting Started

1. Open your project in VSCode.
2. Authenticate Snapfolio using the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Snapfolio: Authenticate."
3. Customize snippets, add text to Notion, create Notion pages, and explore content using the available commands.

## Commands

- `Snapfolio: Authenticate`: Authenticate Snapfolio with your Notion account.
- `Snapfolio: Customize Snippet`: Customize code snippet settings.
- `Snapfolio: Add Text to Notion`: Add text to your Notion pages.
- `Snapfolio: Add Code to Notion`: Add code (programming + output) to your Notion pages.
- `Snapfolio: Create Notion Page`: Create a new Notion page.
- `Snapfolio: Explorer View`: Open the Snapfolio Explorer View.

## Configuration

- `snapfolio.theme`: Set the default theme for code snippets.
- `snapfolio.fontSize`: Set the default font size for code snippets.
- `snapfolio.backgroundColor`: Set the default background color for code snippets.
- `snapfolio.botId`: Store the bot ID after authentication.
- `snapfolio.pageId`: Store the current page ID.

## Backend Node-Express API

Snapfolio relies on a Node-Express backend API for handling Notion interactions. Explore the backend repository at [Backend Repository](https://github.com/Jasleen8801/Snapfolio-API).

## Feedback

If you encounter any issues or have suggestions, please [open an issue](https://github.com/Jasleen8801/snapfolio/issues) on GitHub.

## Contributing

Feel free to contribute to the development of Snapfolio. Fork the repository, make your changes, and submit a pull request.
