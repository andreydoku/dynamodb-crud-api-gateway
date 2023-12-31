import { DynamoDBClient, GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { uuid } from 'uuidv4';
import { Todo } from "./Todo";
import { User } from "./User";

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
			id: unmarshalledItem.todoId, 
			title: unmarshalledItem.title, 
			isDone: unmarshalledItem.isDone,
			userId: unmarshalledItem.userId
		};
		return todo;
		
	}
	async createTodo( todo:Todo ) : Promise<Todo> {
		
		todo.id = uuid();
		
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
            Key: marshall({ id: id }),
        };
        await db.send(new DeleteItemCommand(params));
		
		return todo;
		
	}
	
	
	async getAllTodos(user:User) : Promise<Todo[]> {
		
		const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
			FilterExpression : 'userId = :userId',
  			ExpressionAttributeValues : {':userId' : {"S":user.id} }
        };
		const { Items } = await db.send(new ScanCommand(params));
		
		
		if( !Items ){
			throw new Error("failed to get stuff from DB");
		}
		
		
		const todos:Todo[] = Items
			.map( item => unmarshall(item) )
			.map( item => { 
				return {
					userId: item.userId,
					
					id: item.id, 
					title:item.title, 
					isDone: item.isDone
				} 
			});
		
		return todos;
	}
	
	
}