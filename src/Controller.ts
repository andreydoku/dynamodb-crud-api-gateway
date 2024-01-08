import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Todo } from './Todo';

import { Service } from "./Service";
import { User } from './User';


const service:Service = new Service();

//   GET /todos/{todoId}
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


function getUserFromEvent(event: APIGatewayProxyEvent) : User{
	
	const claims = event?.requestContext?.authorizer?.claims;
	
	const user:User = {
		id: claims.sub,
		firstName: claims.given_name,
		lastName: claims.family_name
	};
	
	return user;
}

//   POST /todos
export const createTodo: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	const user:User = getUserFromEvent( event );
	console.log( "received createTodo request from user: " + JSON.stringify(user) );
	
	
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
		userId: user.id,
		id: null, 
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

//   DELETE /todos/{todoId}
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
				message: "Failed to delete todo.",
				errorMsg: e.message,
				errorStack: e.stack,
			})
		};
	}
	
}


//   GET /todos
export const getAllTodos: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	
	const user:User = getUserFromEvent( event );
	console.log( "received getAllTodos request from user: " + JSON.stringify(user) );
	
	try {
		
		const todos:Todo[] = await service.getAllTodos(user);
		
		const response = {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": '*',
				"Access-Control-Allow-Credentials": false,
			},
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