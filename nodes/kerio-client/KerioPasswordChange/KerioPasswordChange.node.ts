import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeProperties,
} from 'n8n-workflow';

export class KerioPasswordChange implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kerio Password Change',
		name: 'kerioPasswordChange',
		icon: 'file:../email.svg',
		group: ['Kerio Connect'],
		version: 1,
		description: 'Manage Password',
		defaults: {
			name: 'Kerio Password Change',
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
				displayName: 'Change Password',
				name: 'changePassword',
				value: 'changePassword',
				description: 'Change/Update email account password',
				action: 'Change Password',
				noDataExpression: true,
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
				displayName: 'Current Password',
				name: 'currpwd',
				type: 'string',
				default: '',
				required: true,
				hint: 'Current password',
			},
			{
				displayName: 'New Password',
				name: 'newpwd',
				type: 'string',
				default: '',
				required: true,
				hint: 'New password',
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
			//const operation = this.getNodeParameter('operation', i) as string;

			//if (operation === 'changePassword') {
				const xtoken = this.getNodeParameter('token', i) as string;
				const cookie = this.getNodeParameter('cookie', i) as string;
				const currpwd = this.getNodeParameter('currpwd', i) as string;
				const newpwd = this.getNodeParameter('newpwd', i) as string;

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
						method: 'Session.setPassword',
						params: {
							currentPassword: currpwd,
							newPassword: newpwd,
						},
					},
				};

				const response = await this.helpers.request!(requestOptions);
				returnItems.push({ json: response.body.result });
			}
		//}

		return [returnItems];
	}
}
