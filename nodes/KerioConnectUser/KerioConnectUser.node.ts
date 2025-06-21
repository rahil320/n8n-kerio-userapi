import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';

export class KerioConnectUser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kerio Connect User',
		name: 'kerioConnectUser',
		icon: 'file:email.svg',
		group: ['Kerio Connect'],
		version: 1,
		description: 'Manage Kerio Connect User Operations',
		defaults: {
			name: 'Kerio Connect User',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'kerioConnectUserApi',
				required: true,
			},
		],
		properties: [
			// Resource field
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Authentication', value: 'authentication', description: 'Authenticate to Kerio Connect' },
					{ name: 'AutoResponder', value: 'autoresponder', description: 'AutoResponder management' },
					{ name: 'Calendar', value: 'calendar', description: 'Calendar management' },
					{ name: 'Contact', value: 'contact', description: 'Contact management' },
					{ name: 'Folder', value: 'folder', description: 'Folder management' },
					{ name: 'Mail', value: 'mails', description: 'Mail management' },
					{ name: 'Misc', value: 'misc', description: 'Misc operations' },
					{ name: 'Note', value: 'notes', description: 'Notes management' },
					{ name: 'Task', value: 'task', description: 'Task management' },
				],
				default: 'authentication',
				required: true,
			},
			// Authentication Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage authentication to Kerio Connect',
				options: [
					{ name: 'Login', value: 'login', action: 'Login an authentication' },
					{ name: 'Logout', value: 'logout', action: 'Logout an authentication' },
				],
				default: 'login',
				required: true,
				displayOptions: { show: { resource: ['authentication'] } },
			},
			// AutoResponder Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage autoresponder',
				options: [
					{ name: 'Get AutoResponder', value: 'getAutoResponder', description: 'Get autoresponder settings', action: 'Get autoresponder settings' },
					{ name: 'Set AutoResponder', value: 'setAutoResponder', description: 'Set autoresponder settings', action: 'Set autoresponder settings' },
					{ name: 'Set Timed AutoResponder', value: 'setTimedAutoResponder', description: 'Set timed autoresponder settings', action: 'Set timed autoresponder settings' },
					{ name: 'Disable AutoResponder', value: 'disableAutoResponder', action: 'Disable autoresponder' },
				],
				default: 'getAutoResponder',
				required: true,
				displayOptions: { show: { resource: ['autoresponder'] } },
			},
			// Folder Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage folders',
				options: [
					{ name: 'Create Folder', value: 'createFolder', description: 'Create a folder', action: 'Create folder' },
					{ name: 'Delete Folder', value: 'deleteFolder', description: 'Delete a folder', action: 'Delete folder' },
					{ name: 'Get Folders', value: 'getFolders', description: 'Get all folders', action: 'Get all folders' },
					{ name: 'Get Public Folders', value: 'getPublicFolders', description: 'Get all public folders', action: 'Get public folders' },
					{ name: 'Get Subscribed Folders', value: 'getSubscribedFolders', description: 'Get all subscribed folders', action: 'Get subscribed folders' },
					{ name: 'Search Folder', value: 'searchFolder', description: 'Search for folders', action: 'Search folder' },
				],
				default: 'getFolders',
				required: true,
				displayOptions: { show: { resource: ['folder'] } },
			},
			// Misc Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage misc operations',
				options: [
					{ name: 'Change Password', value: 'changePassword', description: 'Change email account password', action: 'Change email account password' },
					{ name: 'Change Webmail Color', value: 'changeWebmailColor', description: 'Change webmail color theme', action: 'Change webmail color theme' },
					{ name: 'Get Account Details', value: 'getAccountDetails', description: 'Get account details of the current user', action: 'Get account details' },
					{ name: 'Get Alarm', value: 'getAlarm', description: 'Get alarms within a time range', action: 'Get alarms within a time range' },
					{ name: 'Get Available Languages', value: 'getAvailableLanguages', description: 'Get available languages for webmail', action: 'Get available languages' },
					{ name: 'Get Available Timezones', value: 'getAvailableTimezones', description: 'Get available timezones for webmail', action: 'Get available timezones' },
					{ name: 'Get Email Settings', value: 'getEmailSettings', description: 'Get email settings for the current user', action: 'Get email settings' },
					{ name: 'Get Quota', value: 'getQuota', description: 'Get mailbox quota information', action: 'Get mailbox quota' },
					{ name: 'Get Webmail Settings', value: 'getWebmailSettings', description: 'Get webmail settings for the current user', action: 'Get webmail settings' },
					{ name: 'Set Email Settings', value: 'setEmailSettings', description: 'Set email receipt settings', action: 'Set email settings' },
				],
				default: 'getQuota',
				required: true,
				displayOptions: { show: { resource: ['misc'] } },
			},
			// Add userStyle dropdown for Change Webmail Color
			{
				displayName: 'Webmail Color Style',
				name: 'userStyle',
				type: 'options',
				options: [
					{ name: 'Black', value: 'webmail2color-121212' },
					{ name: 'Blue', value: 'webmail2' },
					{ name: 'Brown', value: 'webmail2color-753802' },
					{ name: 'Dark Green', value: 'webmail2color-548C00' },
					{ name: 'Dark Grey', value: 'webmail2color-424242' },
					{ name: 'Dark Maroon', value: 'webmail2color-54071A' },
					{ name: 'Dark Orange', value: 'webmail2color-BE5D0F' },
					{ name: 'Dark Pink', value: 'webmail2color-C42790' },
					{ name: 'Dark Purple', value: 'webmail2color-6E237C' },
					{ name: 'Light Green', value: 'webmail2color-5DB559' },
					{ name: 'Light Grey', value: 'webmail2color-808080' },
					{ name: 'Light Maroon', value: 'webmail2color-A60000' },
					{ name: 'Light Orange', value: 'webmail2color-CF6666' },
					{ name: 'Light Pink', value: 'webmail2color-CE64A3' },
					{ name: 'Light Purple', value: 'webmail2color-7F7FC7' },
					{ name: 'Navy Blue', value: 'webmail2color-133D69' },
					{ name: 'Turquoise', value: 'webmail2color-2EC9B7' },
					{ name: 'X-Dark Green', value: 'webmail2color-063900' },
				],
				default: 'webmail2',
				required: true,
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['changeWebmailColor'],
					},
				},
				hint: 'Select the webmail color style',
			},
			// Calendar Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage calendar events',
				options: [
					{ name: 'Create Event', value: 'createEvent', description: 'Create a new calendar event', action: 'Create a new calendar event' },
					{ name: 'Get Calendar Events', value: 'getCalendarEvents', description: 'Get calendar events within a time range', action: 'Get calendar events' },
					{ name: 'Remove Event', value: 'removeEvent', description: 'Remove a calendar event', action: 'Remove a calendar event' },
				],
				default: 'getCalendarEvents',
				required: true,
				displayOptions: { show: { resource: ['calendar'] } },
			},
			// Mails Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage mails',
				options: [
					{ name: 'Delete Mail', value: 'deleteMail', description: 'Delete or move mail to trash', action: 'Delete mail' },
					{ name: 'Get Mails', value: 'getMails', description: 'Get mails from a folder', action: 'Get mails from a folder' },
					{ name: 'Search Mail', value: 'searchMail', description: 'Search for mails', action: 'Search for mails' },
					{ name: 'Send Mail', value: 'sendMail', description: 'Send a new email', action: 'Send a new email' },
					{ name: 'Set Properties', value: 'setProperties', description: 'Set mail properties like read/unread or flag status', action: 'Set mail properties' },
				],
				default: 'getMails',
				required: true,
				displayOptions: { show: { resource: ['mails'] } },
			},
			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage contacts',
				options: [
					{ name: 'Add Contact', value: 'addContact', description: 'Add a new contact', action: 'Add a new contact' },
					{ name: 'Delete Contact', value: 'deleteContact', description: 'Delete a contact', action: 'Delete a contact' },
					{ name: 'Get Contacts', value: 'getContacts', description: 'Get all contacts', action: 'Get all contacts' },
					{ name: 'Search Contact', value: 'searchContact', description: 'Search for contacts', action: 'Search for contacts' },
					{ name: 'Update Contact', value: 'updateContact', description: 'Update an existing contact', action: 'Update an existing contact' },
				],
				default: 'getContacts',
				required: true,
				displayOptions: { show: { resource: ['contact'] } },
			},
			// Task Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage tasks',
				options: [
					{ name: 'Create Task', value: 'createTask', description: 'Create a new task', action: 'Create a new task' },
					{ name: 'Delete Task', value: 'deleteTask', description: 'Delete a task', action: 'Delete a task' },
					{ name: 'Edit Task', value: 'editTask', description: 'Edit an existing task', action: 'Edit an existing task' },
					{ name: 'Get Tasks', value: 'getTasks', description: 'Get all tasks', action: 'Get all tasks' },
					{ name: 'Update Task', value: 'updateTask', description: 'Update an existing task', action: 'Update an existing task' },
				],
				default: 'getTasks',
				required: true,
				displayOptions: { show: { resource: ['task'] } },
			},
			// Notes Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage notes',
				options: [
					{ name: 'Get Notes', value: 'getNotes', description: 'Get all notes', action: 'Get all notes' },
					{ name: 'Create Note', value: 'createNote', description: 'Create a new note', action: 'Create a new note' },
					{ name: 'Edit Note', value: 'editNote', description: 'Edit an existing note', action: 'Edit an existing note' },
					{ name: 'Delete Note', value: 'deleteNote', description: 'Delete a note', action: 'Delete a note' },
				],
				default: 'getNotes',
				required: true,
				displayOptions: { show: { resource: ['notes'] } },
			},
			// Contact fields for Add/Edit operations
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['deleteContact', 'updateContact'],
					},
				},
				hint: 'ID of the contact to delete/update',
			},
			{
				displayName: 'Common Name',
				name: 'commonName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				hint: 'Full name of the contact',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				hint: 'First name of the contact',
			},
			{
				displayName: 'Surname',
				name: 'surName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				hint: 'Surname of the contact',
			},
			{
				displayName: 'Email',
				name: 'contactEmail',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				placeholder: 'name@email.com',
				hint: 'Email address of the contact',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				hint: 'Phone number of the contact',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				hint: 'Company name',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['addContact', 'updateContact'],
					},
				},
				options: [
					{
						displayName: 'Anniversary',
						name: 'anniversary',
						type: 'dateTime',
						default: '',
						hint: 'Anniversary date',
					},
					{
						displayName: 'Assistant Name',
						name: 'assistantName',
						type: 'string',
						default: '',
						hint: 'Assistant name',
					},
					{
						displayName: 'Birthday',
						name: 'birthDay',
						type: 'dateTime',
						default: '',
						hint: 'Birthday of the contact',
					},
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						default: '',
						hint: 'Additional comments about the contact',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						hint: 'Country',
					},
					{
						displayName: 'Department Name',
						name: 'departmentName',
						type: 'string',
						default: '',
						hint: 'Department name',
					},
					{
						displayName: 'Extended Address',
						name: 'extendedAddress',
						type: 'string',
						default: '',
						hint: 'Extended address information',
					},
					{
						displayName: 'IM Address',
						name: 'IMAddress',
						type: 'string',
						default: '',
						hint: 'Instant messaging address',
					},
					{
						displayName: 'Locality',
						name: 'locality',
						type: 'string',
						default: '',
						hint: 'City or locality',
					},
					{
						displayName: 'Manager Name',
						name: 'managerName',
						type: 'string',
						default: '',
						hint: 'Manager name',
					},
					{
						displayName: 'Middle Name',
						name: 'middleName',
						type: 'string',
						default: '',
						hint: 'Middle name of the contact',
					},
					{
						displayName: 'Nickname',
						name: 'nickName',
						type: 'string',
						default: '',
						hint: 'Nickname of the contact',
					},
					{
						displayName: 'Profession',
						name: 'profession',
						type: 'string',
						default: '',
						hint: 'Profession of the contact',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						hint: 'State or province',
					},
					{
						displayName: 'Street',
						name: 'street',
						type: 'string',
						default: '',
						hint: 'Street address',
					},
					{
						displayName: 'Title After',
						name: 'titleAfter',
						type: 'string',
						default: '',
						hint: 'Title after name (e.g., Jr, Sr)',
					},
					{
						displayName: 'Title Before',
						name: 'titleBefore',
						type: 'string',
						default: '',
						hint: 'Title before name (e.g., Mr, Dr)',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						hint: 'Website URL',
					},
					{
						displayName: 'ZIP Code',
						name: 'zip',
						type: 'string',
						default: '',
						hint: 'ZIP or postal code',
					},
				],
			},
			// Folder ID field (reusable across operations)
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getContacts',
							'searchContact',
						],
					},
				},
				hint: 'ID of the folder to work with (optional)',
			},
			// Required Folder ID field for Add Contact operation
			{
				displayName: 'Folder ID',
				name: 'folderIdRequired',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['addContact'],
					},
				},
				hint: 'ID of the folder to add the contact to (required)',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['searchContact'],
					},
				},
				hint: 'Search term to find contacts',
			},
			// Add property type selection for setProperties operation
			{
				displayName: 'Property Type',
				name: 'propertyType',
				type: 'options',
				default: 'markReadUnread',
				options: [
					{ name: 'Mark Read/Unread', value: 'markReadUnread' },
					{ name: 'Change Flag', value: 'changeFlag' },
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['setProperties'],
					},
				},
				hint: 'Select the type of property to set',
			},
			// Add mail ID field for setProperties operation
			{
				displayName: 'Mail ID',
				name: 'mailId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['setProperties'],
					},
				},
				hint: 'ID of the mail to modify',
			},
			// Add read/unread status field
			{
				displayName: 'Read Status',
				name: 'isSeen',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['setProperties'],
						propertyType: ['markReadUnread'],
					},
				},
				required: true,
				hint: 'Set to true to mark as read, false to mark as unread',
			},
			// Add flag status field
			{
				displayName: 'Flag Status',
				name: 'isFlagged',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['setProperties'],
						propertyType: ['changeFlag'],
					},
				},
				required: true,
				hint: 'Set to true to flag the mail, false to unflag',
			},
			// Mail folder ID field
			{
				displayName: 'Folder ID',
				name: 'mailFolderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['getMails'],
					},
				},
				hint: 'ID of the mail folder to get mails from',
			},
			// Required Mail folder ID field for Search Mail operation
			{
				displayName: 'Folder ID',
				name: 'mailFolderIdRequired',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['searchMail'],
					},
				},
				hint: 'ID of the mail folder to search in (required)',
			},
			// Calendar event date range fields
			{
				displayName: 'Start Date Time',
				name: 'calendarStart',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['getCalendarEvents'],
					},
				},
				required: true,
				hint: 'Start date/time for calendar events range',
			},
			{
				displayName: 'End Date Time',
				name: 'calendarEnd',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['getCalendarEvents'],
					},
				},
				required: true,
				hint: 'End date/time for calendar events range',
			},
			{
				displayName: 'Folder ID',
				name: 'calendarFolderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['getCalendarEvents'],
					},
				},
				required: true,
				hint: 'ID of the calendar folder to get events from',
			},
			// Token and Cookie fields (required for most operations)
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						operation: [
							'logout',
							'changePassword',
							'changeWebmailColor',
							'getAccountDetails',
							'getAutoResponder',
							'setAutoResponder',
							'setTimedAutoResponder',
							'disableAutoResponder',
							'getFolders',
							'getPublicFolders',
							'searchFolder',
							'createFolder',
							'deleteFolder',
							'getQuota',
							'getAlarm',
							'getAvailableLanguages',
							'getAvailableTimezones',
							'getEmailSettings',
							'getWebmailSettings',
							'setEmailSettings',
							'createEvent',
							'getCalendarEvents',
							'removeEvent',
							'getSubscribedFolders',
							'getMails',
							'searchMail',
							'setProperties',
							'sendMail',
							'deleteMail',
							'getContacts',
							'addContact',
							'updateContact',
							'deleteContact',
							'searchContact',
							'getTasks',
							'createTask',
							'editTask',
							'updateTask',
							'deleteTask',
							'getNotes',
							'createNote',
							'editNote',
							'deleteNote',
						],
					},
				},
				required: true,
				hint: 'Session token from Kerio Connect login',
			},
			{
				displayName: 'Cookie',
				name: 'cookie',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'logout',
							'changePassword',
							'changeWebmailColor',
							'getAccountDetails',
							'getAutoResponder',
							'setAutoResponder',
							'setTimedAutoResponder',
							'disableAutoResponder',
							'getFolders',
							'getPublicFolders',
							'searchFolder',
							'createFolder',
							'deleteFolder',
							'getQuota',
							'getAlarm',
							'getAvailableLanguages',
							'getAvailableTimezones',
							'getEmailSettings',
							'getWebmailSettings',
							'setEmailSettings',
							'createEvent',
							'getCalendarEvents',
							'removeEvent',
							'getSubscribedFolders',
							'getMails',
							'searchMail',
							'setProperties',
							'sendMail',
							'deleteMail',
							'getContacts',
							'addContact',
							'updateContact',
							'deleteContact',
							'searchContact',
							'getTasks',
							'createTask',
							'editTask',
							'updateTask',
							'deleteTask',
							'getNotes',
							'createNote',
							'editNote',
							'deleteNote',
						],
					},
				},
				required: true,
				hint: 'Session cookie from Kerio Connect login',
			},
			// Password change fields
			{
				displayName: 'Current Password',
				name: 'currpwd',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['changePassword'],
					},
				},
				required: true,
				hint: 'Current password',
			},
			{
				displayName: 'New Password',
				name: 'newpwd',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['changePassword'],
					},
				},
				required: true,
				hint: 'New password',
			},
			// AutoResponder fields
			{
				displayName: 'Message',
				name: 'msg',
				type: 'string',
				default: 'I am on leave',
				displayOptions: {
					show: {
						operation: ['setAutoResponder', 'setTimedAutoResponder'],
					},
				},
				required: true,
				hint: 'Type autoresponder message',
			},
			{
				displayName: 'Start Date Time',
				name: 'startDateTime',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['setTimedAutoResponder'],
					},
				},
				required: true,
				hint: 'Start date/time for activating autoresponder',
			},
			{
				displayName: 'End Date Time',
				name: 'endDateTime',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['setTimedAutoResponder'],
					},
				},
				required: true,
				hint: 'End date/time to disable autoresponder',
			},
			// Add a field for folder name, shown only for createFolder operation
			{
				displayName: 'Folder Name',
				name: 'folderName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['createFolder'],
					},
				},
				hint: 'Name of the folder to create',
			},
			// Add a field for parent folder ID, shown only for createFolder operation
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'string',
				default: '',
				//required: false,
				hint: 'Parent folder ID (leave blank for root folders)',
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['createFolder'],
					},
				},
			},
			// Add a field for folder ID to delete, shown only for deleteFolder operation
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				required: true,
				hint: 'ID of the folder to delete',
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['deleteFolder'],
					},
				},
			},
			// Add folder type selection for searchFolder operation
			{
				displayName: 'Folder Type',
				name: 'folderType',
				type: 'options',
				default: 'FMail',
				options: [
					{ name: 'Calendar', value: 'FCalendar' },
					{ name: 'Contact', value: 'FContact' },
					{ name: 'Mails', value: 'FMail' },
					{ name: 'Note', value: 'FNote' },
					{ name: 'Root', value: 'FRoot' },
					{ name: 'Task', value: 'FTask' },
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['folder'],
						operation: ['searchFolder','createFolder'],
					},
				},
				hint: 'Select the type of folder to search',
			},
			// Add date range fields for getAlarm operation
			{
				displayName: 'Start Date Time',
				name: 'since',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['getAlarm'],
					},
				},
				required: true,
				hint: 'Start date/time for alarm range',
			},
			{
				displayName: 'End Date Time',
				name: 'until',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['getAlarm'],
					},
				},
				required: true,
				hint: 'End date/time for alarm range',
			},
			// Add fields for Send Mail operation
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				hint: 'Sender email address',
			},
			{
				displayName: 'From Name',
				name: 'fromName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				hint: 'Sender name (optional)',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				options: [
					{
						name: 'recipients',
						displayName: 'Recipient',
						values: [
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								required: true,
								placeholder: 'name@email.com',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'CC',
				name: 'cc',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				options: [
					{
						name: 'recipients',
						displayName: 'Recipient',
						values: [
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								required: true,
								placeholder: 'name@email.com',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				options: [
					{
						name: 'recipients',
						displayName: 'Recipient',
						values: [
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								required: true,
								placeholder: 'name@email.com',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				hint: 'Email subject',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				hint: 'Email message content (HTML supported)',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 'Normal',
				options: [
					{ name: 'Low', value: 'Low' },
					{ name: 'Normal', value: 'Normal' },
					{ name: 'High', value: 'High' },
				],
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				hint: 'Email priority',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['sendMail'],
					},
				},
				options: [
					{
						displayName: 'Encrypt',
						name: 'encrypt',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Sign',
						name: 'sign',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Request DSN',
						name: 'requestDSN',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Send MDN',
						name: 'isMDNSent',
						type: 'boolean',
						default: true,
					},
				],
			},
			// Add deletion type selection for deleteMail operation
			{
				displayName: 'Deletion Type',
				name: 'deletionType',
				type: 'options',
				default: 'moveToTrash',
				options: [
					{ name: 'Move to Trash', value: 'moveToTrash' },
					{ name: 'Permanent Delete', value: 'permanentDelete' },
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['deleteMail'],
					},
				},
				hint: 'Select how to delete the mail',
			},
			// Add mail IDs field for deleteMail operation
			{
				displayName: 'Mail IDs',
				name: 'mailIds',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['deleteMail'],
					},
				},
				options: [
					{
						name: 'ids',
						displayName: 'Mail ID',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								required: true,
								placeholder: 'keriostorage://mail/domain/user/mailId',
							},
						],
					},
				],
			},
			// Add trash folder ID field for deleteMail operation
			{
				displayName: 'Trash Folder ID',
				name: 'trashFolderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['deleteMail'],
						deletionType: ['moveToTrash'],
					},
				},
				hint: 'ID of the Trash/Deleted Items folder',
			},
			// Add search query field for searchMail operation
			{
				displayName: 'Search Query',
				name: 'mailSearchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mails'],
						operation: ['searchMail'],
					},
				},
				hint: 'Search term to find mails',
			},
			// Add event ID field for removeEvent operation
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['removeEvent'],
					},
				},
				hint: 'ID of the calendar event to remove',
			},
			// Calendar event creation fields
			{
				displayName: 'Summary',
				name: 'eventSummary',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'Title/summary of the calendar event',
			},
			{
				displayName: 'Description',
				name: 'eventDescription',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'Description of the calendar event',
			},
			{
				displayName: 'Location',
				name: 'eventLocation',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'Location of the calendar event',
			},
			{
				displayName: 'Start Date Time',
				name: 'eventStart',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'Start date/time of the calendar event',
			},
			{
				displayName: 'End Date Time',
				name: 'eventEnd',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'End date/time of the calendar event',
			},
			{
				displayName: 'Calendar Folder ID',
				name: 'eventFolderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				hint: 'ID of the calendar folder to create the event in',
			},
			{
				displayName: 'Attendees',
				name: 'eventAttendees',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				options: [
					{
						name: 'attendees',
						displayName: 'Attendee',
						values: [
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
								required: true,
								placeholder: 'name@email.com',
							},
							{
								displayName: 'Display Name',
								name: 'displayName',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								default: 'RoleRequiredAttendee',
								options: [
									{ name: 'Organizer', value: 'RoleOrganizer' },
									{ name: 'Required Attendee', value: 'RoleRequiredAttendee' },
									{ name: 'Optional Attendee', value: 'RoleOptionalAttendee' },
								],
							},
							{
								displayName: 'Notify',
								name: 'isNotified',
								type: 'boolean',
								default: false,
							},
						],
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'eventAdditionalOptions',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						resource: ['calendar'],
						operation: ['createEvent'],
					},
				},
				options: [
					{
						displayName: 'All Day Event',
						name: 'isAllDay',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Free/Busy Status',
						name: 'freeBusy',
						type: 'options',
						default: 'Busy',
						options: [
							{ name: 'Busy', value: 'Busy' },
							{ name: 'Free', value: 'Free' },
							{ name: 'Tentative', value: 'Tentative' },
							{ name: 'Out of Office', value: 'OutOfOffice' },
						],
					},
					{
						displayName: 'Priority',
						name: 'eventPriority',
						type: 'options',
						default: 'Normal',
						options: [
							{ name: 'Low', value: 'Low' },
							{ name: 'Normal', value: 'Normal' },
							{ name: 'High', value: 'High' },
						],
					},
					{
						displayName: 'Private Event',
						name: 'isPrivate',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Reminder',
						name: 'reminder',
						type: 'collection',
						default: {},
						options: [
							{
								displayName: 'Set Reminder',
								name: 'isSet',
								type: 'boolean',
								default: true,
							},
							{
								displayName: 'Minutes Before Start',
								name: 'minutesBeforeStart',
								type: 'number',
								default: 15,
								typeOptions: {
									minValue: 1,
								},
								displayOptions: {
									show: {
										isSet: [true],
									},
								},
							},
						],
					},
					{
						displayName: 'Travel Time (Minutes)',
						name: 'travelMinutes',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
						},
					},
				],
			},
			// Task fields for Create/Edit/Update operations
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['deleteTask', 'editTask', 'updateTask'],
					},
				},
				hint: 'ID of the task to delete/edit/update',
			},
			{
				displayName: 'Task Title',
				name: 'taskTitle',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask', 'editTask', 'updateTask'],
					},
				},
				hint: 'Title of the task',
			},
			{
				displayName: 'Task Description',
				name: 'taskDescription',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask', 'editTask', 'updateTask'],
					},
				},
				hint: 'Description of the task',
			},
			{
				displayName: 'Due Date',
				name: 'taskDueDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask', 'editTask', 'updateTask'],
					},
				},
				hint: 'Due date for the task',
			},
			{
				displayName: 'Done',
				name: 'taskDone',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask', 'editTask'],
					},
				},
				hint: 'Whether the task is completed',
			},

			{
				displayName: 'Reminder',
				name: 'taskReminder',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask', 'editTask'],
					},
				},
				options: [
					{
						displayName: 'Set Reminder',
						name: 'isSet',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Reminder Date',
						name: 'reminderDate',
						type: 'dateTime',
						default: '',
						displayOptions: {
							show: {
								isSet: [true],
							},
						},
					},
				],
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
					},
				},
				hint: 'ID of the folder to create the task in',
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['getTasks'],
					},
				},
				hint: 'ID of the folder to get tasks from (optional)',
			},
			// Notes fields for Create/Edit/Delete operations
			{
				displayName: 'Note ID',
				name: 'noteId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['deleteNote', 'editNote'],
					},
				},
				hint: 'ID of the note to delete/edit',
			},
			{
				displayName: 'Note Title',
				name: 'noteTitle',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['createNote', 'editNote'],
					},
				},
				hint: 'Title of the note',
			},
			{
				displayName: 'Note Content',
				name: 'noteContent',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['createNote', 'editNote'],
					},
				},
				hint: 'Content of the note',
			},
			{
				displayName: 'Note Color',
				name: 'noteColor',
				type: 'options',
				default: 'Pink',
				options: [
					{ name: 'Blue', value: 'Blue' },
					{ name: 'Green', value: 'Green' },
					{ name: 'Pink', value: 'Pink' },
					{ name: 'White', value: 'White' },
					{ name: 'Yellow', value: 'Yellow' },
				],
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['createNote', 'editNote'],
					},
				},
				hint: 'Color of the note',
			},
			{
				displayName: 'Folder ID',
				name: 'noteFolderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['createNote'],
					},
				},
				hint: 'ID of the folder to create the note in',
			},
			{
				displayName: 'Folder ID',
				name: 'noteFolderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['getNotes'],
					},
				},
				hint: 'ID of the folder to get notes from (optional)',
			},
			{
				displayName: 'Folder ID',
				name: 'noteFolderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notes'],
						operation: ['editNote'],
					},
				},
				hint: 'ID of the folder containing the note',
			},
			// Email Settings fields for Set Email Settings operation
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						resource: ['misc'],
						operation: ['setEmailSettings'],
					},
				},
				options: [
					{
						displayName: 'Allow Remote Images',
						name: 'mailImgAllowRemote',
						type: 'boolean',
						default: false,
						 hint: 'Allow remote images in emails',
					},
					{
						displayName: 'Delivery Receipt',
						name: 'deliveryReceipt',
						type: 'boolean',
						default: false,
						 hint: 'Enable or disable delivery receipts',
					},
					{
						displayName: 'Email Preview Place',
						name: 'emailPreviewPlace',
						type: 'string',
						default: '',
						 hint: 'Location of the email preview pane',
					},
					{
						displayName: 'Mail Signature',
						name: 'mailSignature',
						type: 'string',
						default: '',
						 hint: 'Signature for outgoing emails',
					},
					{
						displayName: 'Mark as Read',
						name: 'mailMarkAsRead',
						type: 'boolean',
						default: false,
						 hint: 'Automatically mark emails as read',
					},
					{
						displayName: 'Mark as Read Delay',
						name: 'mailMarkAsReadDelay',
						type: 'number',
						default: 0,
						 hint: 'Delay in milliseconds before marking as read',
					},
					{
						displayName: 'Page Size',
						name: 'pageSize',
						type: 'options',
						default: 50,
						options: [
							{ name: '50', value: 50 },
							{ name: '100', value: 100 },
							{ name: '250', value: 250 },
							{ name: '500', value: 500 },
						],
						hint: 'Number of emails per page',
					},
					{
						displayName: 'Read Receipt',
						name: 'readReceipt',
						type: 'boolean',
						default: false,
						 hint: 'Enable or disable read receipts',
					},
					{
						displayName: 'Select First Email',
						name: 'selectFirstEmail',
						type: 'boolean',
						default: false,
						 hint: 'Automatically select the first email',
					},
				],
			},
		] as INodeProperties[],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];

		const credentials = (await this.getCredentials('kerioConnectUserApi')) as {
			serverUrl: string;
			username: string;
			password: string;
		};
		const serverUrl = credentials.serverUrl.replace(/\/+$/, '');

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			const requestOptions: any = {
				method: 'POST',
				url: `${serverUrl}/webmail/api/jsonrpc/`,
				headers: {
					'Content-Type': 'application/json-rpc',
					Cookie: '', // Default blank Cookie header
				},
				json: true,
				resolveWithFullResponse: true,
			};

			if (resource === 'authentication') {
				if (operation === 'login') {
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.login',
						params: {
							application: {
								vendor: 'Rahil Sarwar',
								name: 'n8n-kerio-userapi',
								version: '1.0',
							},
							userName: credentials.username,
							password: credentials.password,
						},
					};

					const response = await this.helpers.request!(requestOptions);
					const token = response.body?.result?.token;
					const setCookieHeader = response.headers?.['set-cookie'];
					const cookie = Array.isArray(setCookieHeader) ? setCookieHeader[0]?.split(';')[0] : '';

					returnItems.push({
						json: {
							token,
							cookie,
						},
					});
				} else if (operation === 'logout') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.logout',
						params: {
							token,
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'password') {
				if (operation === 'changePassword') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const currpwd = this.getNodeParameter('currpwd', i) as string;
					const newpwd = this.getNodeParameter('newpwd', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.setPassword',
						params: {
							currentPassword: currpwd,
							newPassword: newpwd,
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'autoresponder') {
				if (operation === 'getAutoResponder') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.getOutOfOffice',
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'setAutoResponder') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const msg = this.getNodeParameter('msg', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.setOutOfOffice',
						params: {
							settings: {
								isEnabled: true,
								text: msg,
								isTimeRangeEnabled: false,
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'setTimedAutoResponder') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const msg = this.getNodeParameter('msg', i) as string;
					const startdatetime = this.getNodeParameter('startDateTime', i) as Date;
					const enddatetime = this.getNodeParameter('endDateTime', i) as Date;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.setOutOfOffice',
						params: {
							settings: {
								isEnabled: true,
								text: msg,
								isTimeRangeEnabled: true,
								timeRangeStart: startdatetime,
								timeRangeEnd: enddatetime,
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'disableAutoResponder') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.setOutOfOffice',
						params: {
							settings: {
								isEnabled: false,
								isTimeRangeEnabled: false,
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'folder') {
				if (operation === 'getFolders') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 5,
						method: 'Folders.get',
						params: {},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'searchFolder') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderType = this.getNodeParameter('folderType', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 9,
						jsonrpc: '2.0',
						method: 'Folders.get',
						params: {},
					};

					const response = await this.helpers.request!(requestOptions);

					// Filter the folders based on the selected type
					if (response.body?.result?.list) {
						const filteredFolders = response.body.result.list.filter((folder: any) => folder.type === folderType);
						returnItems.push({
							json: {
								list: filteredFolders,
								totalItems: filteredFolders.length
							}
						});
					} else {
						returnItems.push({ json: response.body.result });
					}
				} else if (operation === 'getPublicFolders') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;

					const requestOptions: any = {
						method: 'POST',
						url: `${serverUrl}/webmail/api/jsonrpc/`,
						headers: {
							'Content-Type': 'application/json-rpc',
							Cookie: cookie,
							'X-Token': token,
						},
						json: true,
						resolveWithFullResponse: true,
						body: {
							id: 9,
							jsonrpc: '2.0',
							method: 'Folders.getPublic',
							params: {},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getSubscribedFolders') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;

					const requestOptions: any = {
						method: 'POST',
						url: `${serverUrl}/webmail/api/jsonrpc/`,
						headers: {
							'Content-Type': 'application/json-rpc',
							Cookie: cookie,
							'X-Token': token,
						},
						json: true,
						resolveWithFullResponse: true,
						body: {
							id: 9,
							jsonrpc: '2.0',
							method: 'Folders.getSubscribed',
							params: {},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'createFolder') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderName = this.getNodeParameter('folderName', i) as string;
					const parentFolderId = this.getNodeParameter('parentFolderId', i) as string;
					const folderType = this.getNodeParameter('folderType', i) as string;

					// Base folder properties
					const baseFolderProps = {
						access: 'FAccessAdmin',
						checked: false,
						color: '',
						id: '',
						name: folderName,
						ownerName: '',
						parentId: parentFolderId || '',
						placeType: 'FPlaceMailbox',
						subType: 'FSubNone',
					};

					// Add type-specific properties
					let folderProps;
					switch (folderType) {
						case 'FMail':
							folderProps = {
								...baseFolderProps,
								type: 'FMail',
							};
							break;
						case 'FCalendar':
							folderProps = {
								...baseFolderProps,
								type: 'FCalendar',
								subType: 'FSubNone',
							};
							break;
						case 'FContact':
							folderProps = {
								...baseFolderProps,
								type: 'FContact',
								subType: 'FSubNone',
							};
							break;
						case 'FNote':
							folderProps = {
								...baseFolderProps,
								type: 'FNote',
								subType: 'FSubNone',
							};
							break;
						case 'FTask':
							folderProps = {
								...baseFolderProps,
								type: 'FTask',
								subType: 'FSubNone',
							};
							break;
						case 'FRoot':
							folderProps = {
								...baseFolderProps,
								type: 'FRoot',
								subType: 'FSubNone',
								parentId: '', // Root folders don't have parents
							};
							break;
						default:
							throw new NodeOperationError(this.getNode(), `Unsupported folder type: ${folderType}`);
					}

					const requestOptions: any = {
						method: 'POST',
						url: `${serverUrl}/webmail/api/jsonrpc/`,
						headers: {
							'Content-Type': 'application/json-rpc',
							Cookie: cookie,
							'X-Token': token,
						},
						json: true,
						resolveWithFullResponse: true,
						body: {
							id: 21,
							jsonrpc: '2.0',
							method: 'Folders.create',
							params: {
								folders: [folderProps],
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'deleteFolder') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('folderId', i) as string;

					const requestOptions: any = {
						method: 'POST',
						url: `${serverUrl}/webmail/api/jsonrpc/`,
						headers: {
							'Content-Type': 'application/json-rpc',
							Cookie: cookie,
							'X-Token': token,
						},
						json: true,
						resolveWithFullResponse: true,
						body: {
							id: 19,
							jsonrpc: '2.0',
							method: 'Folders.removeByType',
							params: {
								ids: [folderId],
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'mails') {
				if (operation === 'getMails') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('mailFolderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 72,
						jsonrpc: '2.0',
						method: 'Mails.get',
						params: {
							folderIds: [folderId],
							query: {
								fields: [
									'id',
									'from',
									'to',
									'subject',
									'receiveDate',
									'modifiedDate',
									'sendDate',
									'isSeen',
									'isJunk',
									'isAnswered',
									'isForwarded',
									'isFlagged',
									'isReadOnly',
									'isDraft',
									'folderId',
									'hasAttachment',
									'priority',
									'size'
								],
								limit: 50,
								orderBy: [
									{
										caseSensitive: true,
										columnName: 'receiveDate',
										direction: 'Desc'
									}
								],
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'setProperties') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const mailId = this.getNodeParameter('mailId', i) as string;
					const propertyType = this.getNodeParameter('propertyType', i) as string;

					let mailProperties: any = {
						id: mailId,
					};

					if (propertyType === 'markReadUnread') {
						const isSeen = this.getNodeParameter('isSeen', i) as boolean;
						mailProperties.isSeen = isSeen;
					} else if (propertyType === 'changeFlag') {
						const isFlagged = this.getNodeParameter('isFlagged', i) as boolean;
						mailProperties.isFlagged = isFlagged;
					}

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 139,
						jsonrpc: '2.0',
						method: 'Mails.set',
						params: {
							mails: [mailProperties],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'sendMail') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const fromEmail = this.getNodeParameter('fromEmail', i) as string;
					const fromName = this.getNodeParameter('fromName', i) as string;
					const to = this.getNodeParameter('to', i) as { recipients: Array<{ email: string; name?: string }> };
					const cc = this.getNodeParameter('cc', i) as { recipients: Array<{ email: string; name?: string }> };
					const bcc = this.getNodeParameter('bcc', i) as { recipients: Array<{ email: string; name?: string }> };
					const subject = this.getNodeParameter('subject', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const priority = this.getNodeParameter('priority', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
						encrypt?: boolean;
						sign?: boolean;
						requestDSN?: boolean;
						isMDNSent?: boolean;
					};

					// Format recipients
					const formatRecipients = (recipients: Array<{ email: string; name?: string }>) => {
						return recipients.map((recipient) => ({
							address: recipient.email,
							name: recipient.name || '',
						}));
					};

					const mailData = {
						attachments: [],
						bcc: formatRecipients(bcc.recipients || []),
						cc: formatRecipients(cc.recipients || []),
						displayableParts: [
							{
								content: message,
								contentType: 'ctTextHtml',
							},
						],
						encrypt: additionalOptions.encrypt || false,
						from: {
							address: fromEmail,
							name: fromName,
						},
						headers: [],
						isAnswered: false,
						isDraft: false,
						isFlagged: false,
						isForwarded: false,
						isJunk: false,
						isMDNSent: additionalOptions.isMDNSent !== undefined ? additionalOptions.isMDNSent : true,
						isReadOnly: false,
						isSeen: true,
						notificationTo: {},
						priority,
						replyTo: [],
						requestDSN: additionalOptions.requestDSN || false,
						send: true,
						sender: {},
						showExternal: false,
						sign: additionalOptions.sign || false,
						subject,
						to: formatRecipients(to.recipients),
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 29,
						jsonrpc: '2.0',
						method: 'Mails.create',
						params: {
							mails: [mailData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'deleteMail') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const deletionType = this.getNodeParameter('deletionType', i) as string;
					const mailIds = this.getNodeParameter('mailIds', i) as { ids: Array<{ id: string }> };

					// Extract mail IDs
					const ids = mailIds.ids.map((item) => item.id);

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;

					if (deletionType === 'permanentDelete') {
						requestOptions.body = {
							jsonrpc: '2.0',
							id: 60,
							method: 'Mails.remove',
							params: {
								ids,
							},
						};
					} else {
						// Move to trash
						const trashFolderId = this.getNodeParameter('trashFolderId', i) as string;
						requestOptions.body = {
							jsonrpc: '2.0',
							id: 61,
							method: 'Mails.move',
							params: {
								ids,
								destinationFolderId: trashFolderId,
							},
						};
					}

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'searchMail') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const searchQuery = this.getNodeParameter('mailSearchQuery', i) as string;
					const folderId = this.getNodeParameter('mailFolderIdRequired', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 19,
						method: 'Mails.get',
						params: {
							folderIds: [folderId],
							query: {
								conditions: [
									{
										comparator: 'Like',
										fieldName: 'FULLTEXT',
										value: searchQuery
									}
								],
								fields: [
									'id',
									'from',
									'to',
									'subject',
									'receiveDate',
									'modifiedDate',
									'sendDate',
									'isSeen',
									'isJunk',
									'isAnswered',
									'isForwarded',
									'isFlagged',
									'isReadOnly',
									'isDraft',
									'folderId',
									'hasAttachment',
									'priority',
									'size'
								],
								limit: 50,
								orderBy: [
									{
										caseSensitive: true,
										columnName: 'receiveDate',
										direction: 'Desc'
									}
								],
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'misc') {
				if (operation === 'changePassword') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const currpwd = this.getNodeParameter('currpwd', i) as string;
					const newpwd = this.getNodeParameter('newpwd', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.setPassword',
						params: {
							currentPassword: currpwd,
							newPassword: newpwd,
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'changeWebmailColor') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const userStyle = this.getNodeParameter('userStyle', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 32,
						method: 'Session.setSettings',
						params: {
							settings: {
								webmail: {
									userStyle,
								},
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getAccountDetails') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 7,
						jsonrpc: '2.0',
						method: 'Session.whoAmI',
						params: {},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getAvailableLanguages') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 24,
						jsonrpc: '2.0',
						method: 'Session.getAvailableLanguages',
						params: {},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getAvailableTimezones') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 23,
						jsonrpc: '2.0',
						method: 'Session.getAvailableTimeZones',
						params: {},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getEmailSettings') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 22,
						jsonrpc: '2.0',
						method: 'Session.getSettings',
						params: {
							query: [
								[
									'webmail',
									'mailSignature'
								],
								[
									'webmail',
									'mailMarkAsRead'
								],
								[
									'webmail',
									'mailMarkAsReadDelay'
								],
								[
									'webmail',
									'mailImgAllowRemote'
								],
								[
									'webmail',
									'emailPreviewPlace'
								],
								[
									'webmail',
									'readReceipt'
								],
								[
									'webmail',
									'deliveryReceipt'
								],
								[
									'webmail',
									'pageSize'
								],
								[
									'webmail',
									'selectFirstEmail'
								]
							]
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getWebmailSettings') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 25,
						jsonrpc: '2.0',
						method: 'Session.getSettings',
						params: {

							query: [
								[
									'webmail',
									'lang'
								],
								[
									'webmail',
									'timeZone'
								],
								[
									'webmail',
									'timeFormat'
								],
								[
									'webmail',
									'dateFormat'
								],
								[
									'webmail',
									'langExtension'
								],
								[
									'webmail',
									'firstWeekDay'
								]
							]
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'setEmailSettings') {
					const token = this.getNodeParameter('token', i) as string;
					const cookie = this.getNodeParameter('cookie', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
						mailSignature?: string;
						mailMarkAsRead?: boolean;
						mailMarkAsReadDelay?: number;
						mailImgAllowRemote?: boolean;
						emailPreviewPlace?: string;
						readReceipt?: boolean;
						deliveryReceipt?: boolean;
						pageSize?: number;
						selectFirstEmail?: boolean;
					};

					// Build webmail settings object with only user-selected fields
					const webmailSettings: any = {};

					if (additionalOptions.mailSignature !== undefined) {
						webmailSettings.mailSignature = additionalOptions.mailSignature;
					}
					if (additionalOptions.mailMarkAsRead !== undefined) {
						webmailSettings.mailMarkAsRead = additionalOptions.mailMarkAsRead;
					}
					if (additionalOptions.mailMarkAsReadDelay !== undefined) {
						webmailSettings.mailMarkAsReadDelay = additionalOptions.mailMarkAsReadDelay;
					}
					if (additionalOptions.mailImgAllowRemote !== undefined) {
						webmailSettings.mailImgAllowRemote = additionalOptions.mailImgAllowRemote;
					}
					if (additionalOptions.emailPreviewPlace !== undefined) {
						webmailSettings.emailPreviewPlace = additionalOptions.emailPreviewPlace;
					}
					if (additionalOptions.readReceipt !== undefined) {
						webmailSettings.readReceipt = additionalOptions.readReceipt;
					}
					if (additionalOptions.deliveryReceipt !== undefined) {
						webmailSettings.deliveryReceipt = additionalOptions.deliveryReceipt;
					}
					if (additionalOptions.pageSize !== undefined) {
						webmailSettings.pageSize = additionalOptions.pageSize;
					}
					if (additionalOptions.selectFirstEmail !== undefined) {
						webmailSettings.selectFirstEmail = additionalOptions.selectFirstEmail;
					}

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 19,
						method: 'Session.setSettings',
						params: {
							settings: {
								webmail: webmailSettings,
							},
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getQuota') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.getQuotaInformation',
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'getAlarm') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const since = this.getNodeParameter('since', i) as string;
					const until = this.getNodeParameter('until', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 11,
						jsonrpc: '2.0',
						method: 'Alarms.get',
						 params: {
						 	since,
						 	until,
						 },
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'calendar') {
				if (operation === 'createEvent') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const summary = this.getNodeParameter('eventSummary', i) as string;
					const folderId = this.getNodeParameter('eventFolderId', i) as string;
					const start = this.getNodeParameter('eventStart', i) as string;
					const end = this.getNodeParameter('eventEnd', i) as string;
					const attendees = this.getNodeParameter('eventAttendees', i) as { attendees: Array<{ email: string; displayName?: string; role: string; isNotified: boolean }> };
					const description = this.getNodeParameter('eventDescription', i) as string;
					const location = this.getNodeParameter('eventLocation', i) as string;
					const additionalOptions = this.getNodeParameter('eventAdditionalOptions', i) as {
						isAllDay?: boolean;
						eventPriority?: string;
						freeBusy?: string;
						isPrivate?: boolean;
						travelMinutes?: number;
						reminder?: {
							isSet?: boolean;
							minutesBeforeStart?: number;
						};
					};

					// Format date to ISO string with timezone
					const formatDate = (dateValue: string) => {
						const date = new Date(dateValue);
						return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '+0000');
					};

					// Format attendees
					const formatAttendees = (attendeesList: Array<{ email: string; displayName?: string; role: string; isNotified: boolean }>) => {
						return attendeesList.map((attendee) => ({
							displayName: attendee.displayName || '',
							emailAddress: attendee.email,
							isNotified: attendee.isNotified,
							role: attendee.role,
						}));
					};

					// Event data with current fields plus travel time and reminder
					const eventData = {
						summary: summary,
						start: formatDate(start),
						end: formatDate(end),
						folderId: folderId,
						watermark: 0,
						attendees: formatAttendees(attendees.attendees || []),
						description: description || '',
						descriptionHtml: '',
						location: location || '',
						priority: additionalOptions.eventPriority || 'Normal',
						isAllDay: additionalOptions.isAllDay || false,
						freeBusy: additionalOptions.freeBusy || 'Busy',
						isPrivate: additionalOptions.isPrivate || false,
						travelMinutes: additionalOptions.travelMinutes || 0,
						reminder: {
							isSet: additionalOptions.reminder?.isSet !== undefined ? additionalOptions.reminder.isSet : true,
							minutesBeforeStart: additionalOptions.reminder?.minutesBeforeStart || 15,
							type: 'ReminderRelative'
						}
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 46,
						 method: 'Events.create',
						 params: {
						 	events: [eventData]
						 }
					};

					try {
						const response = await this.helpers.request!(requestOptions);
						returnItems.push({
							json: {
								success: true,
								result: response.body.result,
								requestBody: requestOptions.body
							}
						});
					} catch (error) {
						returnItems.push({
							json: {
								success: false,
								error: error.message,
								requestBody: requestOptions.body
							}
						});
						throw error;
					}
				} else if (operation === 'getCalendarEvents') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const start = this.getNodeParameter('calendarStart', i) as string;
					const end = this.getNodeParameter('calendarEnd', i) as string;
					const folderId = this.getNodeParameter('calendarFolderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 28,
						method: 'Occurrences.get',
						params: {
							query: {
								fields: [
									'id', 'eventId', 'folderId', 'watermark', 'access', 'summary',
									'location', 'description', 'descriptionHtml', 'label', 'categories',
									'start', 'end', 'travelMinutes', 'freeBusy', 'isPrivate', 'isAllDay',
									'priority', 'rule', 'attendees', 'reminder', 'isException',
									'hasReminder', 'isRecurrent', 'isCancelled', 'seqNumber',
									'modification', 'attachments'
								],
								start: 0,
								limit: -1,
								combining: 'And',
								conditions: [
									{
										fieldName: 'start',
										comparator: 'GreaterEq',
										value: start
									},
									{
										fieldName: 'end',
										comparator: 'LessThan',
										value: end
									}
								]
							},
							folderIds: [folderId]
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'removeEvent') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const eventId = this.getNodeParameter('eventId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 29,
						method: 'Occurrences.remove',
						params: {
							occurrences: [
								{
									id: eventId,
									modification: 'modifyThis'
								}
							]
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'contact') {
				if (operation === 'getContacts') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('folderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 11,
						method: 'Contacts.getFromCache',
						params: {
							folderIds: folderId ? [folderId] : [],
							query: {
								fields: [
									'id',
									'folderId',
									'watermark',
									'type',
									'commonName',
									'titleAfter',
									'titleBefore',
									'firstName',
									'middleName',
									'surName',
									'nickName',
									'emailAddresses',
									'phoneNumbers',
									'photo',
									'companyName'
								],
								limit: 25000,
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'addContact') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('folderIdRequired', i) as string;
					const commonName = this.getNodeParameter('commonName', i) as string;
					const firstName = this.getNodeParameter('firstName', i) as string;
					const surName = this.getNodeParameter('surName', i) as string;
					const email = this.getNodeParameter('contactEmail', i) as string;
					const phone = this.getNodeParameter('phone', i) as string;
					const companyName = this.getNodeParameter('companyName', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
						middleName?: string;
						titleBefore?: string;
						titleAfter?: string;
						nickName?: string;
						departmentName?: string;
						profession?: string;
						managerName?: string;
						assistantName?: string;
						comment?: string;
						IMAddress?: string;
						birthDay?: string;
						anniversary?: string;
						street?: string;
						state?: string;
						locality?: string;
						zip?: string;
						country?: string;
						extendedAddress?: string;
						url?: string;
					};

					// Format date fields if provided
					const formatDate = (dateValue: string | undefined) => {
						if (!dateValue) return '';
						const date = new Date(dateValue);
						return date.toISOString().slice(0, 10).replace(/-/g, '');
					};

					const contactData = {
						folderId,
						watermark: 0,
						type: 'ctContact',
						commonName,
						firstName,
						middleName: additionalOptions.middleName || '',
						surName,
						titleBefore: additionalOptions.titleBefore || '',
						titleAfter: additionalOptions.titleAfter || '',
						nickName: additionalOptions.nickName || '',
						phoneNumbers: phone ? [{
							type: 'TypeMobile',
							number: phone,
							extension: { label: '', groupId: '' },
						}] : [],
						emailAddresses: [{
							address: email,
							name: '',
							preferred: false,
							isValidCertificate: false,
							type: 'EmailWork',
							refId: '',
							extension: { label: '', groupId: '' },
						}],
						postalAddresses: (additionalOptions.street || additionalOptions.state || additionalOptions.locality || additionalOptions.zip || additionalOptions.country || additionalOptions.extendedAddress) ? [{
							preferred: false,
							pobox: '',
							extendedAddress: additionalOptions.extendedAddress || '',
							street: additionalOptions.street || '',
							locality: additionalOptions.locality || '',
							state: additionalOptions.state || '',
							zip: additionalOptions.zip || '',
							country: additionalOptions.country || '',
							label: '',
							type: 'AddressWork',
							extension: { label: '', groupId: '' },
						}] : [],
						urls: additionalOptions.url ? [{
							type: 'UrlWork',
							url: additionalOptions.url,
							extension: { label: '', groupId: '' },
						}] : [],
						birthDay: formatDate(additionalOptions.birthDay),
						anniversary: formatDate(additionalOptions.anniversary),
						companyName,
						departmentName: additionalOptions.departmentName || '',
						profession: additionalOptions.profession || '',
						managerName: additionalOptions.managerName || '',
						assistantName: additionalOptions.assistantName || '',
						comment: additionalOptions.comment || '',
						IMAddress: additionalOptions.IMAddress || '',
						photo: { id: '', url: '' },
						certSourceId: '',
						isGalContact: false,
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 18,
						method: 'Contacts.create',
						params: {
							contacts: [contactData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'deleteContact') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const contactId = this.getNodeParameter('contactId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Contacts.remove',
						params: {
							ids: [contactId],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'searchContact') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const searchQuery = this.getNodeParameter('searchQuery', i) as string;
					const folderId = this.getNodeParameter('folderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 11,
						method: 'Contacts.getFromCache',
						params: {
							folderIds: folderId ? [folderId] : [],
							query: {
								conditions: [
									{
										comparator: 'Like',
										fieldName: 'QUICKSEARCH',
										value: searchQuery
									}
								],
								fields: [
									'id',
									'folderId',
									'watermark',
									'type',
									'commonName',
									'titleAfter',
									'titleBefore',
									'firstName',
									'middleName',
									'surName',
									'nickName',
									'emailAddresses',
									'phoneNumbers',
									'photo',
									'companyName'
								],
								limit: 25000,
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'updateContact') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const contactId = this.getNodeParameter('contactId', i) as string;
					const commonName = this.getNodeParameter('commonName', i) as string;
					const firstName = this.getNodeParameter('firstName', i) as string;
					const surName = this.getNodeParameter('surName', i) as string;
					const email = this.getNodeParameter('contactEmail', i) as string;
					const phone = this.getNodeParameter('phone', i) as string;
					const companyName = this.getNodeParameter('companyName', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
						middleName?: string;
						titleBefore?: string;
						titleAfter?: string;
						nickName?: string;
						departmentName?: string;
						profession?: string;
						managerName?: string;
						assistantName?: string;
						comment?: string;
						IMAddress?: string;
						birthDay?: string;
						anniversary?: string;
						street?: string;
						state?: string;
						locality?: string;
						zip?: string;
						country?: string;
						extendedAddress?: string;
						url?: string;
					};

					// Format date fields if provided
					const formatDate = (dateValue: string | undefined) => {
						if (!dateValue) return '';
						const date = new Date(dateValue);
						return date.toISOString().slice(0, 10).replace(/-/g, '');
					};

					const contactData = {
						id: contactId,
						watermark: 0,
						type: 'ctContact',
						commonName,
						firstName,
						middleName: additionalOptions.middleName || '',
						surName,
						titleBefore: additionalOptions.titleBefore || '',
						titleAfter: additionalOptions.titleAfter || '',
						nickName: additionalOptions.nickName || '',
						phoneNumbers: phone ? [{
							type: 'TypeMobile',
							number: phone,
							extension: { label: '', groupId: '' },
						}] : [],
						emailAddresses: [{
							address: email,
							name: '',
							preferred: false,
							isValidCertificate: false,
							type: 'EmailWork',
							refId: '',
							extension: { label: '', groupId: '' },
						}],
						postalAddresses: (additionalOptions.street || additionalOptions.state || additionalOptions.locality || additionalOptions.zip || additionalOptions.country || additionalOptions.extendedAddress) ? [{
							preferred: false,
							pobox: '',
							extendedAddress: additionalOptions.extendedAddress || '',
							street: additionalOptions.street || '',
							locality: additionalOptions.locality || '',
							state: additionalOptions.state || '',
							zip: additionalOptions.zip || '',
							country: additionalOptions.country || '',
							label: '',
							type: 'AddressWork',
							extension: { label: '', groupId: '' },
						}] : [],
						urls: additionalOptions.url ? [{
							type: 'UrlWork',
							url: additionalOptions.url,
							extension: { label: '', groupId: '' },
						}] : [],
						birthDay: formatDate(additionalOptions.birthDay),
						anniversary: formatDate(additionalOptions.anniversary),
						companyName,
						departmentName: additionalOptions.departmentName || '',
						profession: additionalOptions.profession || '',
						managerName: additionalOptions.managerName || '',
						assistantName: additionalOptions.assistantName || '',
						comment: additionalOptions.comment || '',
						IMAddress: additionalOptions.IMAddress || '',
						photo: { id: '', url: '' },
						certSourceId: '',
						isGalContact: false,
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 18,
						method: 'Contacts.set',
						params: {
							contacts: [contactData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'task') {
				if (operation === 'getTasks') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('folderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 11,
						method: 'Tasks.get',
						params: {
							folderIds: folderId ? [folderId] : [],
							query: {
								limit: 500,
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'createTask') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('folderId', i) as string;
					const title = this.getNodeParameter('taskTitle', i) as string;
					const description = this.getNodeParameter('taskDescription', i) as string;
					const dueDate = this.getNodeParameter('taskDueDate', i) as string;
					const taskDone = this.getNodeParameter('taskDone', i) as boolean;
					const reminder = this.getNodeParameter('taskReminder', i) as {
						isSet?: boolean;
						reminderDate?: string;
					};

					// Format date to ISO string with timezone (YYYYMMDDTHHMMSS+HHMM format)
					const formatDate = (dateValue: string) => {
						if (!dateValue) return '';
						const date = new Date(dateValue);
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						const seconds = String(date.getSeconds()).padStart(2, '0');

						// Get timezone offset
						const offset = date.getTimezoneOffset();
						const offsetHours = Math.abs(Math.floor(offset / 60));
						const offsetMinutes = Math.abs(offset % 60);
						const offsetSign = offset <= 0 ? '+' : '-';
						const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

						return `${year}${month}${day}T${hours}${minutes}${seconds}${offsetString}`;
					};


					const taskData = {
						description: description || '',
						done: taskDone ? 100 : 0,
						due: formatDate(dueDate),
						folderId: folderId,
						id: '',
						reminder: reminder.isSet && reminder.reminderDate ? {
							date: formatDate(reminder.reminderDate),
							isSet: true,
							type: 'ReminderAbsolute'
						} : undefined,
						sortOrder: 2147483647,
						summary: title
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 177,
						method: 'Tasks.create',
						params: {
							tasks: [taskData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'editTask') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const taskId = this.getNodeParameter('taskId', i) as string;
					const title = this.getNodeParameter('taskTitle', i) as string;
					const description = this.getNodeParameter('taskDescription', i) as string;
					const dueDate = this.getNodeParameter('taskDueDate', i) as string;
					const taskDone = this.getNodeParameter('taskDone', i) as boolean;
					const reminder = this.getNodeParameter('taskReminder', i) as {
						isSet?: boolean;
						reminderDate?: string;
					};

					// Format date to ISO string with timezone (YYYYMMDDTHHMMSS+HHMM format)
					const formatDate = (dateValue: string) => {
						if (!dateValue) return '';
						const date = new Date(dateValue);
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						const seconds = String(date.getSeconds()).padStart(2, '0');

						// Get timezone offset
						const offset = date.getTimezoneOffset();
						const offsetHours = Math.abs(Math.floor(offset / 60));
						const offsetMinutes = Math.abs(offset % 60);
						const offsetSign = offset <= 0 ? '+' : '-';
						const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

						return `${year}${month}${day}T${hours}${minutes}${seconds}${offsetString}`;
					};

					const taskData = {
						description: description || '',
						done: taskDone ? 100 : 0,
						due: formatDate(dueDate),
						id: taskId,
						reminder: reminder.isSet && reminder.reminderDate ? {
							date: formatDate(reminder.reminderDate),
							isSet: true,
							type: 'ReminderAbsolute'
						} : undefined,
						summary: title
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 206,
						method: 'Tasks.set',
						params: {
							tasks: [taskData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'updateTask') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const taskId = this.getNodeParameter('taskId', i) as string;
					const title = this.getNodeParameter('taskTitle', i) as string;
					const description = this.getNodeParameter('taskDescription', i) as string;
					const dueDate = this.getNodeParameter('taskDueDate', i) as string;
					const taskDone = this.getNodeParameter('taskDone', i) as boolean;
					const reminder = this.getNodeParameter('taskReminder', i) as {
						isSet?: boolean;
						reminderDate?: string;
					};

					// Format date to ISO string with timezone
					const formatDate = (dateValue: string) => {
						if (!dateValue) return '';
						const date = new Date(dateValue);
						return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '+0000');
					};

					const taskData = {
						id: taskId,
						watermark: 0,
						type: 'ctTask',
						summary: title,
						description: description || '',
						dueDate: formatDate(dueDate),
						done: taskDone ? 100 : 0,
						reminder: {
							isSet: reminder.isSet,
							reminderDate: reminder.reminderDate ? formatDate(reminder.reminderDate) : undefined,
						},
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 18,
						method: 'Tasks.set',
						params: {
							tasks: [taskData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'deleteTask') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const taskId = this.getNodeParameter('taskId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Tasks.remove',
						params: {
								ids: [taskId],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'notes') {
				if (operation === 'getNotes') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('noteFolderId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						id: 37,
						jsonrpc: '2.0',
						method: 'Notes.get',
						params: {
							folderIds: folderId ? [folderId] : [],
							query: {
								limit: -1,
								orderBy: [
									{
										caseSensitive: true,
										columnName: 'createDate',
										direction: 'Desc'
									}
								],
								start: 0
							}
						}
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'createNote') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const folderId = this.getNodeParameter('noteFolderId', i) as string;
					const title = this.getNodeParameter('noteTitle', i) as string;
					const content = this.getNodeParameter('noteContent', i) as string;
					const color = this.getNodeParameter('noteColor', i) as string;

					const noteData = {
						text: content || title || '',
						position: {},
						folderId: folderId,
						color: color
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 40,
						method: 'Notes.create',
						params: {
							notes: [noteData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'editNote') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const noteId = this.getNodeParameter('noteId', i) as string;
					const title = this.getNodeParameter('noteTitle', i) as string;
					const content = this.getNodeParameter('noteContent', i) as string;
					const color = this.getNodeParameter('noteColor', i) as string;
					const folderId = this.getNodeParameter('noteFolderId', i) as string;

					// Format current date to ISO string with timezone (YYYYMMDDTHHMMSS+HHMM format)
					const formatDate = () => {
						const date = new Date();
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						const seconds = String(date.getSeconds()).padStart(2, '0');

						// Get timezone offset
						const offset = date.getTimezoneOffset();
						const offsetHours = Math.abs(Math.floor(offset / 60));
						const offsetMinutes = Math.abs(offset % 60);
						const offsetSign = offset <= 0 ? '+' : '-';
						const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

						return `${year}${month}${day}T${hours}${minutes}${seconds}${offsetString}`;
					};

					const noteData = {
						color: color,
						folderId: folderId,
						id: noteId,
						modifyDate: formatDate(),
						position: {
							xOffset: 0,
							xSize: 0,
							yOffset: 0,
							ySize: 0
						},
						text: content || title || '',
						watermark: 0
					};

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 19,
						method: 'Notes.set',
						params: {
							notes: [noteData],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else if (operation === 'deleteNote') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const noteId = this.getNodeParameter('noteId', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;
					requestOptions.body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'Notes.remove',
						params: {
							ids: [noteId],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else {
				throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
			}
		}

		return [returnItems];
	}
}
