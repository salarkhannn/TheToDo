import { format } from "date-fns"; 

export default class Task {
    constructor(name, dueDate, priority = "none", project = "", compeleStatus = false) {
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.compeleStatus = compeleStatus;
    }

    //#region Setters and getter

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setDate(dueDate){
        this.dueDate = dueDate;
    }

    getDate(){
        return this.dueDate;
    }

    setPriority(priority){
        this.priority = priority;
    }

    getPriority(){
        return this.priority;
    }

    setProject(project){
        this.project = project;
    }

    getProject(){
        return this.project;
    }

    getCompleteStatus(){
        return this.compeleStatus;
    }

    setCompleteStatus(compeleStatus){
        this.compeleStatus = compeleStatus;
    }

    //#endregion

    getDateFormatted(){
        return format(this.dueDate, "dd/MM/yyyy");
    }
}