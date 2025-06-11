/**********************************************************************
 * KerioConnect.node.ts
 * Multi-operation node: Login and Logout to Kerio Connect server
 *********************************************************************/

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';

export class KerioConnect implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kerio Connect Authentication',
		name: 'kerioConnect',
		icon: 'file:email.svg',
		group: ['Kerio Connect'],
		version: 1,
		description: 'Interact with Kerio Connect (Login, Logout)',
		defaults: {
			name: 'Kerio Connect',
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
						name: 'Login',
						value: 'login',
						action: 'Login',
						description: 'Login to Kerio Connect',
					},
					{
						name: 'Logout',
						value: 'logout',
						action: 'Logout',
						description: 'Logout from Kerio Connect',
					},
				],
				default: 'login',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						operation: ['logout'],
					},
				},
				required: true,
			},
			{
				displayName: 'Cookie',
				name: 'cookie',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['logout'],
					},
				},
				required: true,
			},
		] as INodeProperties[],
		codex: {
			categories: ['Kerio Connect'],
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];

		const { serverUrl, username, password } = (await this.getCredentials(
			'kerioConnectClientApi',
		)) as {
			serverUrl: string;
			username: string;
			password: string;
		};

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			const requestOptions: any = {
				method: 'POST',
				url: `${serverUrl.replace(/\/+$/, '')}/webmail/api/jsonrpc/`,
				headers: {
					'Content-Type': 'application/json-rpc',
					Cookie: '', // Default blank Cookie header
				},
				json: true,
				resolveWithFullResponse: true,
			};

			if (operation === 'login') {
				requestOptions.body = {
					jsonrpc: '2.0',
					id: 1,
					method: 'Session.login',
					params: {
						application: {
							vendor: 'Rahil Sarwar',
							name: 'n8n-kerio',
							version: '1.0',
						},
						userName: username,
						password,
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
				const sessionId = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;

				requestOptions.body = {
					jsonrpc: '2.0',
					id: 2,
					method: 'Session.logout',
					params: {
						token: sessionId,
					},
				};

				requestOptions.headers.Cookie = cookie;

				const response = await this.helpers.httpRequest(requestOptions);

				returnItems.push({
					json: {
						success: true,
						response: response.body,
					},
				});
			} else {
				throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
			}
		}

		return [returnItems];
	}
}
