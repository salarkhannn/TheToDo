import Project from "./project";
import Dashboard from "./dashboard";
import Task from "./task";


export default class Storage {
    static saveDashboard(data){
        localStorage.setItem('dashboard', JSON.stringify(data))
    }

    static getDashboard(){
        const dashboard = Object.assign(
            new Dashboard(),
            JSON.parse(localStorage.getItem('dashboard'))
        )

        dashboard.setProjects(
            dashboard.getProjects().map((project) => Object.assign(new Project(), project))
        )

        dashboard
            .getProjects()
            .forEach((project) => 
                project.setTasks(
                    project.getTasks().map((task) => Object.assign(new Task(), task))    
                )
            )  
            
        return dashboard
    }

    static addProject(project){
        const dashboard = Storage.getDashboard();
        dashboard.addProject(project);
        Storage.saveDashboard(dashboard);
    }

    static deleteProject(projectName){
        const dashboard = Storage.getDashboard();
        dashboard.deleteProject(projectName);
        Storage.saveDashboard(dashboard);
    }

    static addTask(projectName, task){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).addTask(task);
        Storage.saveDashboard(dashboard);
    }

    static deleteTask(projectName, taskName){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).deleteTask(taskName);
        Storage.saveDashboard(dashboard);
    }

    static renameTask(projectName, taskName, newTaskName){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).getTask(taskName).setName(newTaskName);
        Storage.saveDashboard(dashboard);
    }

    static setTaskDate(projectName, taskName, newDueDate){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).getTask(taskName).setDate(newDueDate);
        Storage.saveDashboard(dashboard);
    }

    static setTaskpriority(projectName, taskName, newPriority){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).getTask(taskName).setPriority(newPriority);
        Storage.saveDashboard(dashboard);
    }

    static setTaskComplete(projectName, taskName, newComplete){
        const dashboard = Storage.getDashboard();
        dashboard.getProject(projectName).getTask(taskName).setCompleteStatus(newComplete);
        Storage.saveDashboard(dashboard);
    }

    static updateHomeProject(){
        const dashboard = Storage.getDashboard();
        dashboard.updateHomeProject();
        Storage.saveDashboard(dashboard);
    }

    static updateTodayProject(){
        const dashboard = Storage.getDashboard();
        dashboard.updateTodayProject();
        Storage.saveDashboard(dashboard);
    }

    static updateWeekProject(){
        const dashboard = Storage.getDashboard();
        dashboard.updateWeekProject();
        Storage.saveDashboard(dashboard);
    }
}