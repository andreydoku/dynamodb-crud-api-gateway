export class Todo {
	
	todoId: string|null;
	title: string;
	isDone: boolean;
	
	constructor( todoId: string , title: string, isDone: boolean ){
		this.todoId = todoId;
		this.title = title;
		this.isDone = isDone;
	}
	
}