# FileServer
This project is a local server to edit files using HTTP requests that I created for class. The assignment originally comes from [Eloquent JS](https://eloquentjavascript.net/20_node.html)

## Description
The page displays the files in your working directory, and allows you to select a folder and edit it.
The text area displays the contents of the selected file. There is a dropdown menu with all available files.
A new file can be created by typing a name into the blank input line under the select menu and pressing the save button.
If a file is selected it can be deleted with the delete button.
A directory can be created by typing a name into the blank input line right above the "Publish Directory" button, and pressing the button.

## To Run
You will need [NodeJs](https://nodejs.org/en/) to run the server. 
After Node is installed you can run the server by locating the filepath in Terminal/CommandPrompt.
Once you are in the directory that contains the server.js file you can run the server by typing "node server.js" into the Terminal.
To access the server webpage navigate to "http://localhost:8000/index.html" in a browser.
