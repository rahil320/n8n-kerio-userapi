import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeProperties,
} from 'n8n-workflow';

export class KerioAutoResponder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kerio AutoResponder',
		name: 'kerioAutoResponder',
		icon: 'file:../email.svg',
		group: ['Kerio Connect'],
		version: 1,
		description: 'Manage AutoResponders',
		defaults: {
			name: 'Kerio AutoResponder',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],

		credentials: [
			{
				name: 'kerioConnectClientApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get AutoResponder',
						value: 'getAutoResponder',
						description: 'Check status of auto responder',
						action: 'Get autoresponder',
					},
					{
						name: 'Set AutoRespoinder',
						value: 'setAutoResponder',
						description: 'Set an auto responder',
						action: 'Set autoresponder',
					},
					{
						name: 'Disable AutoResponder',
						value: 'disableAutoResponder',
						description: 'Disable auto responder',
						action: 'Disable autoresponder',
					},
					{
						name: 'Set Timed AutoResponder',
						value: 'setTimedAutoResponder',
						description: 'Set timed auto responder',
						action: 'Timed autoresponder',
					},
				],
				default: 'getAutoResponder',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				hint: 'Session token from Kerio Connect login',
			},
			{
				displayName: 'Cookie',
				name: 'cookie',
				type: 'string',
				default: '',
				required: true,
				hint: 'Session cookie from Kerio Connect login',
			},
			{
				displayName: 'Message',
				name: 'msg',
				type: 'string',
				default: 'I am on leave',
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

			//---------------------------------
		] as INodeProperties[],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];

		// Retrieve serverUrl from stored credentials
		const credentials = (await this.getCredentials('kerioConnectClientApi')) as {
			serverUrl: string;
			username: string;
			password: string;
		};
		const serverUrl = credentials.serverUrl.replace(/\/+$/, '');

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			if (operation === 'getAutoResponder') {
				const xtoken = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;

				const requestOptions: any = {
					method: 'POST',
					url: `${serverUrl.replace(/\/+$/, '')}/webmail/api/jsonrpc/`,
					headers: {
						'Content-Type': 'application/json-rpc',
						Cookie: cookie,
						'X-Token': xtoken,
					},
					json: true,
					resolveWithFullResponse: true,
					body: {
						jsonrpc: '2.0',
						id: 1,
						method: 'Session.getOutOfOffice',
					},
				};

				const response = await this.helpers.request!(requestOptions);
				returnItems.push({ json: response.body.result });
			}
			else if (operation === 'setAutoResponder') {
				const xtoken = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;
				const msg = this.getNodeParameter('msg', i) as string;

				const requestOptions: any = {
					method: 'POST',
					url: `${serverUrl.replace(/\/+$/, '')}/webmail/api/jsonrpc/`,
					headers: {
						'Content-Type': 'application/json-rpc',
						Cookie: cookie,
						'X-Token': xtoken,
					},
					json: true,
					resolveWithFullResponse: true,
					body: {
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
					},
				};

				const response = await this.helpers.request!(requestOptions);
				returnItems.push({ json: response.body.result });
			}
			else if (operation === 'setTimedAutoResponder') {
				const xtoken = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;
				const msg = this.getNodeParameter('msg', i) as string;
				const startdatetime = this.getNodeParameter('startDateTime', i) as Date;
				const enddatetime = this.getNodeParameter('endDateTime', i) as Date;

				const requestOptions: any = {
					method: 'POST',
					url: `${serverUrl.replace(/\/+$/, '')}/webmail/api/jsonrpc/`,
					headers: {
						'Content-Type': 'application/json-rpc',
						Cookie: cookie,
						'X-Token': xtoken,
					},
					json: true,
					resolveWithFullResponse: true,
					body: {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.setOutOfOffice',
						params: {
							settings: {
								isEnabled: true,
								text: msg,
								isTimeRangeEnabled: true,
								timeRangeStart: startdatetime,
								timeRangeEnd: enddatetime
							},
						},
					},
				};

				const response = await this.helpers.request!(requestOptions);
				returnItems.push({ json: response.body.result });
			}
			else if (operation === 'disableAutoResponder') {
				const xtoken = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;
				//const msg = this.getNodeParameter('msg', i) as string;

				const requestOptions: any = {
					method: 'POST',
					url: `${serverUrl.replace(/\/+$/, '')}/webmail/api/jsonrpc/`,
					headers: {
						'Content-Type': 'application/json-rpc',
						Cookie: cookie,
						'X-Token': xtoken,
					},
					json: true,
					resolveWithFullResponse: true,
					body: {
						jsonrpc: '2.0',
						id: 2,
						method: 'Session.setOutOfOffice',
						params: {
							settings: {
								isEnabled: false,
								//text: ,
								isTimeRangeEnabled: false,
							},
						},
					},
				};

				const response = await this.helpers.request!(requestOptions);
				returnItems.push({ json: response.body.result });
			}
		}

		return [returnItems];
	}
}
