import Project from "./project";
import Task from "./task";
import { getCurrentWeek, formatDate } from '../functions/functions.js'

export default class Dashboard {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('home', 'this tab shows all tasks'));
        this.projects.push(new Project('today', 'these are the tasks that are due today'));
        this.projects.push(new Project('this week', 'these are the tasks that are due this week'));
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProjects() {
        return this.projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.getName() === projectName);
    }

    contains(projectName) {
        return this.projects.some((project) => project.getName() === projectName);
    }

    addProject(newProject) {
        this.projects.push(newProject);
    }

    deleteProject(projectName) {
        this.getProject(projectName).tasks = [];
        this.projects = this.projects.filter((project) => project.getName() !== projectName);
        this.setProjects(this.projects);
    }


    updateTodayProject() {
        const today = new Date().toDateString();
        this.getProject("today").tasks = [];
        this.getProject('home').getTasks().forEach(task => {
            if (new Date(task.getDate()).toDateString() === today) {
                const taskName = `${task.getName()}`;
                this.getProject('today').addTask(new Task(taskName, task.getDate(), task.getPriority(), task.getProject(), task.getCompleteStatus()));
                // console.log(task.getName(), task.getCompleteStatus());
            }
        })
    }

    updateWeekProject() {
        const week = getCurrentWeek();
        this.getProject('this week').tasks = [];
        this.getProject('home').getTasks().forEach(task => {
            const taskDate = new Date(task.getDate());
            if (taskDate >= week.firstDayOfWeek && taskDate <= week.lastDayOfWeek) {
                const taskName = `${task.getName()}`;
                this.getProject('this week').addTask(new Task(taskName, task.getDate(), task.getPriority(), task.getProject(), task.getCompleteStatus()));
            }
        })
    }
    
    updateHomeProject(){
        this.getProject('home').tasks = [];
        this.projects.forEach(project => {
            if(project.getName() == 'today' || project.getName() == 'this week') return;
            project.getTasks().forEach(task => {
                this.getProject('home').addTask(new Task(task.getName(), task.getDate(), task.getPriority(), task.getProject(), task.getCompleteStatus()));
            })
        })
    }
}
