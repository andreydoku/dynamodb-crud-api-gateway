import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({});
import { GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { uuid } from 'uuidv4';

import { Todo } from "./Todo";

export class Service{
	async getAllTodos() : Promise<Todo[]> {
		
		// const dummyTodos: Todo[] = [
		// 	{ todoId: "1", title: "sweep floors"    , isDone: false },
		// 	{ todoId: "2", title: "grocery shopping", isDone: false },
		// 	{ todoId: "3", title: "clean bathroom"  , isDone: false },
		// ];
		
		// return Promise.resolve( dummyTodos );
		
		const { Items } = await db.send(new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }));
		
		
		if( !Items ){
			throw new Error("failed to get stuff from DB");
		}
		
		
		const todos:Todo[] = Items
			.map((item) => unmarshall(item))
			.map( item => { 
				return {todoId: item.todoId, title:item.title, isDone: item.isDone} 
			});
		
		return todos;
	}
}