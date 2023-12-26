import { DynamoDBClient, GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { uuid } from 'uuidv4';
import { Todo } from "./Todo";

const db = new DynamoDBClient({});

export class Service{
	
	async getTodo(id:string) : Promise<Todo> {
		
		const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ todoId: id }),
        };
        let { Item } = await db.send(new GetItemCommand(params));
		
		if( !Item ){
			throw new Error("failed to get stuff from DB");
		}
		
		const unmarshalledItem = unmarshall(Item);
		
		const todo:Todo = {
			todoId: unmarshalledItem.todoId, 
			title: unmarshalledItem.title, 
			isDone: unmarshalledItem.isDone
		};
		return todo;
		
	}
	async createTodo( todo:Todo ) : Promise<Todo> {
		
		todo.todoId = uuid();
		
		const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(todo || {}),
        };
		
		await db.send(new PutItemCommand(params));
		
		return todo;
		
	}
	async deleteTodo( id:string ): Promise<Todo>{
		
		const todo:Todo = await this.getTodo(id);
		
		const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ todoId: id }),
        };
        await db.send(new DeleteItemCommand(params));
		
		return todo;
		
	}
	
	
	async getAllTodos() : Promise<Todo[]> {
		
		const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME
        };
		const { Items } = await db.send(new ScanCommand(params));
		
		
		if( !Items ){
			throw new Error("failed to get stuff from DB");
		}
		
		
		const todos:Todo[] = Items
			.map( item => unmarshall(item) )
			.map( item => { 
				return {todoId: item.todoId, title:item.title, isDone: item.isDone} 
			});
		
		return todos;
	}
	
	
}