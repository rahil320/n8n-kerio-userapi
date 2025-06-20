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
					{ name: 'Password', value: 'password', description: 'Password management' },
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
			// Password Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage email account password',
				options: [
					{ name: 'Change Password', value: 'changePassword', description: 'Change email account password', action: 'Change email account password' },
				],
				default: 'changePassword',
				required: true,
				displayOptions: { show: { resource: ['password'] } },
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
					{ name: 'Get Quota', value: 'getQuota', description: 'Get mailbox quota information', action: 'Get mailbox quota' },
					{ name: 'Get Alarm', value: 'getAlarm', description: 'Get alarms within a time range', action: 'Get alarms within a time range' },
				],
				default: 'getQuota',
				required: true,
				displayOptions: { show: { resource: ['misc'] } },
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
					{ name: 'Notes', value: 'FNote' },
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
				required: true,
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
				if (operation === 'getQuota') {
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

					// Format date to ISO string with timezone
					const formatDate = (dateValue: string) => {
						const date = new Date(dateValue);
						return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '+0000');
					};

					// Minimal event data with only required fields
					const eventData = {
						summary: summary,
						start: formatDate(start),
						end: formatDate(end),
						folderId: folderId,
						watermark: 0
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
			} else {
				throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
			}
		}

		return [returnItems];
	}
}
