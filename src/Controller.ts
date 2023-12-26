import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Todo } from './Todo';
import { Service } from "./Service";

const service:Service = new Service();

// /todos
export const getAllTodos: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		
		const Todos:Todo[] = await service.getAllTodos();
		
		const response = {
			statusCode: 200,
			body: JSON.stringify( Todos )
		};
		return response;
	}
	catch(e: any) {

		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Failed to retrieve todos.",
				errorMsg: e.message,
				errorStack: e.stack,
			})
		};
	}
};