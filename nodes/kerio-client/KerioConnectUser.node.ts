import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
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
					{ name: 'Mail', value: 'mail', description: 'Mail management' },
					{ name: 'Misc', value: 'misc', description: 'Misc operations' },
					{ name: 'Password', value: 'password', description: 'Password management' },
				],
				default: 'authentication',
				required: true,
			},
			// Mail Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				hint: 'Manage mails',
				options: [
					{ name: 'Get mails', value: 'getMails', description: 'Get mails from a folder', action: 'Get mails a mail' },
					{ name: 'Set properties', value: 'setProperties', description: 'Set mail properties', action: 'Set properties a mail' },
				],
				default: 'getMails',
				required: true,
				displayOptions: { show: { resource: ['mail'] } },
			},
			// Property Selection for setProperties
			{
				displayName: 'Property',
				name: 'property',
				type: 'options',
				options: [
					{ name: 'Mark read/unread', value: 'markReadUnread' },
					{ name: 'Change flag', value: 'changeFlag' },
				],
				default: 'markReadUnread',
				required: true,
				displayOptions: {
					show: {
						resource: ['mail'],
						operation: ['setProperties'],
					},
				},
			},
			// Mail ID field for setProperties
			{
				displayName: 'Mail ID',
				name: 'mailId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['mail'],
						operation: ['setProperties'],
					},
				},
				hint: 'ID of the mail to update',
			},
			// Mark Read/Unread Value
			{
				displayName: 'Mark As',
				name: 'isRead',
				type: 'boolean',
				default: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['mail'],
						operation: ['setProperties'],
						property: ['markReadUnread'],
					},
				},
				hint: 'Whether to mark the mail as read or unread',
			},
			// Flag Value
			{
				displayName: 'Flag Status',
				name: 'isFlagged',
				type: 'boolean',
				default: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['mail'],
						operation: ['setProperties'],
						property: ['changeFlag'],
					},
				},
				hint: 'Whether to flag or unflag the mail',
			},
			// ... rest of your existing properties ...
		],
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
					Cookie: '',
				},
				json: true,
				resolveWithFullResponse: true,
			};

			if (resource === 'mail') {
				if (operation === 'getMails') {
					// ... existing getMails implementation ...
				} else if (operation === 'setProperties') {
					const token = this.getNodeParameter('token', i, '') as string;
					const cookie = this.getNodeParameter('cookie', i, '') as string;
					const mailId = this.getNodeParameter('mailId', i) as string;
					const property = this.getNodeParameter('property', i) as string;

					requestOptions.headers.Cookie = cookie;
					requestOptions.headers['X-Token'] = token;

					let mailProperties = {};
					if (property === 'markReadUnread') {
						const isRead = this.getNodeParameter('isRead', i) as boolean;
						mailProperties = { isSeen: isRead };
					} else if (property === 'changeFlag') {
						const isFlagged = this.getNodeParameter('isFlagged', i) as boolean;
						mailProperties = { isFlagged };
					}

					requestOptions.body = {
						id: property === 'markReadUnread' ? 139 : 141,
						jsonrpc: '2.0',
						method: 'Mails.set',
						params: {
							mails: [
								{
									id: mailId,
									...mailProperties,
								},
							],
						},
					};

					const response = await this.helpers.request!(requestOptions);
					returnItems.push({ json: response.body.result });
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
				}
			} else if (resource === 'misc') {
				// ... existing code ...
			}
			// ... rest of your existing resource handlers ...
		}

		return [returnItems];
	}
}
