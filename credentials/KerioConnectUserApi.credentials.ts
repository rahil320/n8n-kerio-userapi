/**********************************************************************
 * credentials/KerioConnectUserApi.credentials.ts
 * Simple credential type: server URL, user, password
 * Includes a 5s timeout on the Test Credentials call.
 * Supports ignoring SSL errors for self-signed certificates.
 *********************************************************************/

import {
  ICredentialType,
  ICredentialTestRequest,
  IAuthenticateGeneric,
  INodeProperties,
} from 'n8n-workflow';

export class KerioConnectUserApi implements ICredentialType {
  name = 'kerioConnectUserApi';
  displayName = 'Kerio Connect User API';
  icon = 'file:email.svg' as const;
  documentationUrl =
    'https://manuals.gfi.com/en/kerio/connect/content/server-configuration/json-rpc-api-kerio-connect-1881.html';

  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'serverUrl',
      type: 'string',
      default: '',
      placeholder: 'https://mail.example.com/',
      hint:
        'Use your Kerio Connect webmail URL. Do not add /webmail.',
    },
    {
      displayName: 'User Email',
      name: 'username',
      type: 'string',
      default: 'admin',
      hint: 'Kerio Connect user email address',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      hint: 'Kerio Connect user email password.',
    },
    {
      displayName: 'Ignore SSL Errors',
      name: 'ignoreSSL',
      type: 'boolean',
      default: false,
      hint: 'Enable this option if your server uses a self-signed certificate.',
    },
  ];

  // Use HTTP Basic under the hood so other nodes can reuse it if needed
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  // Test Credentials: login JSON-RPC + timeout + rules to catch errors
  test: ICredentialTestRequest = {
    request: {
      method: 'POST',
      url: '={{$credentials.serverUrl}}/webmail/api/jsonrpc/',
      headers: {
        'Content-Type': 'application/json-rpc',
      },
      body: {
        jsonrpc: '2.0',
        method: 'Session.login',
        id: 1,
        params: {
          userName: '={{$credentials.username}}',
          password: '={{$credentials.password}}',
	 application: {
           name: 'n8n kerio connect user api',
           vendor: 'Rahil Sarwar',
           version: '1.0'
	   },
        },
      },
      json: true,
      timeout: 5000, // <-- 5 seconds
    },
    rules: [
      // Fail fast if Kerio returns an error object
      {
        type: 'responseSuccessBody',
        properties: {
          key: 'error.code',
	  value: 1000,
          //value: (err: any) => err != null,
          message: 'Invalid credentials — login rejected by server.',
        },
      },
      // Otherwise ensure we got a sessionId
      {
        type: 'responseSuccessBody',
        properties: {
          key: 'result.token',
	  //key: 'error.code',
          value: (sid: any) => typeof sid === 'string',
          message: 'Authentication successful!',
        },
      },
    ],
  };
}
