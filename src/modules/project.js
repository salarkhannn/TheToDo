import Task from './task';

export default class Project {
    constructor(name, description = ""){
        this.name = name;
        this.description = description;
        this.tasks = [];
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setDescription(description){
        this.description = description;
    }

    getDescription(){
        return this.description;
    }

    setTasks(tasks){
        this.tasks = tasks;
    }

    getTasks(){
        return this.tasks;
    }

    getTask(taskName){
        return this.tasks.find((task) => task.getName() === taskName);
    }

    contains(taskName){
        return this.tasks.some((task) => task.getName() === taskName);
    }

    addTask(task){
        if (task instanceof Task){
            this.tasks.push(task);
        } else {
            console.log('Task is not an instance of the class Task');
        }
    }

    deleteTask(taskName){
        this.tasks = this.tasks.filter((task) => task.name != taskName);
    }
}