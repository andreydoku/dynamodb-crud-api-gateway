export class Todo {
	
	userId: string;
	
	id: string|null;
	title: string;
	isDone: boolean;
	
	
	constructor( userId: string , id: string , title: string, isDone: boolean ){
		this.userId = userId;
		
		this.id = id;
		this.title = title;
		this.isDone = isDone;
	}
	
}