import { defineBackend } from '@aws-amplify/backend';
import { sayHello } from './functions/api-proxy/resource';

defineBackend({
	sayHello,
});
