import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Todo } from './Todo';
import { Service } from "./Service";

const service:Service = new Service();

//   /todo/{todoId}
export const getTodo: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	const id:string|undefined = event?.pathParameters?.todoId;
	if( id == undefined ){
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "ID path parameter required",
			})
		};
	}
	
	try {
		
		const todo:Todo = await service.getTodo(id);
		
		const response = {
			statusCode: 200,
			body: JSON.stringify( todo )
		};
		return response;
	}
	catch(e: any) {

		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Failed to get todo.",
				errorMsg: e.message,
				errorStack: e.stack,
			})
		};
	}
	
}

//   /todo
export const createTodo: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	if(!event.body ){
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Request body must contain Todo data",
			})
		};
	}
	
	const requestBody = JSON.parse(event.body);
	const todo:Todo = {
		todoId: null, 
		title: requestBody.title, 
		isDone: requestBody.isDone
	};
	
	if( !todo.title ){
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Request body is missing param title"
			})
		};
	}
	
	
	try {
		
		const createdTodo:Todo = await service.createTodo(todo);
		
		return {
			statusCode: 200,
			body: JSON.stringify( createdTodo )
		};
		
	}
	catch(e: any) {

		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Failed to create todo.",
				errorMsg: e.message,
				errorStack: e.stack,
			})
		};
	}
	
}

//   /todo/{todoId}
export const deleteTodo: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	const id:string|undefined = event?.pathParameters?.todoId;
	if( id == undefined ){
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "ID path parameter required",
			})
		};
	}
	
	
	try {
		
		const deletedTodo:Todo = await service.deleteTodo(id);
		
		return {
			statusCode: 200,
			body: JSON.stringify( deletedTodo )
		};
		
	}
	catch(e: any) {

		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Failed to create todo.",
				errorMsg: e.message,
				errorStack: e.stack,
			})
		};
	}
	
}


//   /todos
export const getAllTodos: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		
		const todos:Todo[] = await service.getAllTodos();
		
		const response = {
			statusCode: 200,
			body: JSON.stringify( todos )
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