![kerio-connect-userapi](https://github.com/user-attachments/assets/abe3df0a-1a3d-46a7-b5ac-c70c972e7d5d)

# n8n-nodes-kerio-userapi

This repo contains Kerio Connect Collaboration Suite User Mode API (webmail client) nodes to help you connect and perform custom integrations for [n8n](https://n8n.io). It includes the nodes and operations for majority of the actions that you can perform using the Kerio Webmail client.

* [Installation](#installation)  
* [Basic Usage](#basicusage)
* [Version history](CHANGELOG.md)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Basic Usage

### 1. Authentication Setup
Start your workflow with the **Kerio Connect User** node and select:
- **Resource**: Authentication
- **Operation**: Login

This node will authenticate with your Kerio Connect server and return the necessary authentication tokens.

### 2. Subsequent Operations
For all other operations (Mail, Calendar, Contacts, etc.), you'll need to:
- Use the **token** and **cookie** values from the Login node's output
- Pass these credentials to subsequent Kerio Connect User nodes

### Example Workflow



## Available Resources and Operations

### Authentication
- **Login**: Authenticate with Kerio Connect server and get session tokens
- **Logout**: End the current session

### Auto Responder
- **Get Auto Responder**: Retrieve current out-of-office settings
- **Set Auto Responder**: Enable out-of-office with custom message
- **Set Timed Auto Responder**: Enable out-of-office with time range and message
- **Disable Auto Responder**: Turn off out-of-office settings

### Folder Management
- **Get Folders**: Retrieve all folders
- **Get Public Folders**: Get shared/public folders
- **Search Folder**: Search for specific folders
- **Create Folder**: Create a new folder
- **Delete Folder**: Remove a folder

### Mail Operations
- **Get Mails**: Retrieve emails from specified folder
- **Send Mail**: Send a new email
- **Delete Mail**: Delete emails (permanently or move to trash)
- **Search Mail**: Search for emails using full-text search

### Calendar
- **Create Event**: Create a new calendar event
- **Get Calendar Events**: Retrieve events from a calendar folder

### Contacts
- **Get Contacts**: Retrieve contacts from specified folder
- **Create Contact**: Add a new contact
- **Edit Contact**: Update existing contact information
- **Delete Contact**: Remove a contact

### Tasks
- **Get Tasks**: Retrieve tasks from specified folder
- **Create Task**: Create a new task
- **Edit Task**: Update existing task
- **Delete Task**: Remove a task

### Notes
- **Get Notes**: Retrieve notes from specified folder
- **Create Note**: Create a new note
- **Edit Note**: Update existing note
- **Delete Note**: Remove a note


### Miscellaneous
- **Change Webmail Color**: Update webmail interface color theme
- **Get Account Details**: Retrieve user account information
- **Get Quota**: Get storage quota information
- **Get Alarm**: Get alarm/notification details
- **Get Available Languages**: Retrieve available language options
- **Get Available Timezones**: Retrieve available timezone options
- **Set Email Settings**: Configure email preferences
- **Change Password**: Change user password
- **Get Webmail Settings**: Get webmail interface settings
- **Set Email Settings**: Set email settings



