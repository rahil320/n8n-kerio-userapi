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
					{ name: 'Get Calendar Events', value: 'getCalendarEvents', description: 'Get calendar events within a time range', action: 'Get calendar events' },
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
					{ name: 'Get Mails', value: 'getMails', description: 'Get mails from a folder', action: 'Get mails from a folder' },
				],
				default: 'getMails',
				required: true,
				displayOptions: { show: { resource: ['mails'] } },
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
							'getCalendarEvents',
							'getSubscribedFolders',
							'getMails',
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
							'createFolder',
							'searchFolder',
							'deleteFolder',
							'getQuota',
							'getAlarm',
							'getCalendarEvents',
							'getSubscribedFolders',
							'getMails',
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
				if (operation === 'getCalendarEvents') {
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
