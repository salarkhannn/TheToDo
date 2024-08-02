import Task from "./task";
import Project from "./project";
import Dashboard from "./dashboard";

import highPriority from "../assets/highPriority.png";
import mediumPriority from "../assets/mediumPriority.png";
import lowPriority from "../assets/lowPriority.png";
import nonePriority from "../assets/nonePriority.png";
import threeDots from "../assets/three-dots.svg";
import { format } from "date-fns";
import Storage from "./storage";

const homeProject = Storage.getDashboard().getProject("home");
const todayProject = Storage.getDashboard().getProject('today');
const thisWeekProject = Storage.getDashboard().getProject('this week');


let currentProject = todayProject;

function displayUI() {
    Storage.updateHomeProject();
    Storage.updateTodayProject();
    Storage.updateWeekProject();

    const app = document.querySelector('#app');
    const content = document.querySelector('#content');
    const wrapper = document.querySelector('#wrapper');

    //#region Sidebar 
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    wrapper.appendChild(sidebar);

    const title = document.createElement('h1');
    title.textContent = "The To-Do";
    title.classList.add('title');
    sidebar.appendChild(title);

    const sidebarHeading = document.createElement('h2');
    sidebarHeading.classList.add('sidebar-heading');
    sidebarHeading.textContent = "general";

    sidebar.appendChild(sidebarHeading);

    const mainList = document.createElement('ul');
    mainList.classList.add('buton-list');

    const homeButton = document.createElement('button');
    const todayButton = document.createElement('button');
    const thisWeekButton = document.createElement('button');

    homeButton.classList.add('tab-button');
    todayButton.classList.add('tab-button');
    thisWeekButton.classList.add('tab-button');
    
    homeButton.textContent = "home";
    todayButton.textContent = "today";
    thisWeekButton.textContent = "this week";

    homeButton.addEventListener('click', () => {
        localStorage.setItem('currentProject', 'home');
        displayTasks(homeProject)
    });
    todayButton.addEventListener('click', () => {
        localStorage.setItem('currentProject', 'today');
        displayTasks(todayProject);
    });
    thisWeekButton.addEventListener('click', () => {
        localStorage.setItem('currentProject', 'this week');
        displayTasks(thisWeekProject)
    });

    mainList.appendChild(homeButton);
    mainList.appendChild(todayButton);
    mainList.appendChild(thisWeekButton);
    sidebar.appendChild(mainList);

    const projectHeading = document.createElement('h2');
    projectHeading.classList.add('sidebar-heading');
    projectHeading.textContent = 'projects';
    sidebar.appendChild(projectHeading);

    const pageList = document.createElement('ul');
    pageList.id = 'project-list';  // Added ID for easy reference

    Storage.getDashboard().getProjects().forEach(function (project) {
        if (project.getName() === 'home' || project.getName() === 'today' || project.getName() === 'this week'){
            return;
        }
        const projectButton = document.createElement('button');
        projectButton.classList.add('tab-button');
        projectButton.textContent = project.getName();
        projectButton.addEventListener('click', () => {
            localStorage.setItem('currentProject', project.getName());
            displayTasks(project);
        });  // Add event listener

        pageList.appendChild(projectButton);
    });
    sidebar.appendChild(pageList);

    const addProject = document.createElement('button');
    addProject.classList.add('add-project-button');
    addProject.textContent = '+ Add Project';
    addProject.addEventListener('click', displayAddProjectForm);  // Add event listener

    sidebar.appendChild(addProject);

    wrapper.appendChild(sidebar);
    //#endregion

    const greeting = document.createElement('p');
    greeting.classList.add('greeting');

    const date = document.createElement('p');
    date.classList.add('date');

    const projectTitle = document.createElement('p');
    projectTitle.classList.add('project-title');
    projectTitle.textContent = "today";

    const description = document.createElement('p');
    description.textContent = todayProject.getDescription();
    description.classList.add('project-description');

    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');
    
    content.appendChild(greeting);
    content.appendChild(date);
    content.appendChild(projectTitle);
    content.appendChild(description);
    content.appendChild(taskContainer);

    const currentLocalPage = localStorage.getItem('currentProject');

    switch (currentLocalPage) {
        case "home":
            displayTasks(homeProject); break;
        case "today":
            displayTasks(todayProject); break;
        case "this week":
            displayTasks(thisWeekProject); break;
        default:
            displayTasks(Storage.getDashboard().getProject(currentLocalPage));
    }
    // displayTasks(Storage.getDashboard().getProject(localStorage.getItem('currentProject')));
}

function displayTasks(project) {
    const content = document.querySelector('#content');
    const greeting = document.querySelector('.greeting');
    const date = document.querySelector('.date');

    if (document.querySelector('.delete-project')) {
        document.querySelector('.delete-project').remove();
    }

    if(project.getName() === 'today' || project.getName() === 'this week' || project.getName() === 'home'){
        greeting.textContent = "hello, user!";
        date.textContent = `it's ${dateToString(new Date())}`;
    } else {
        greeting.textContent = "";
        date.textContent = "";
    }

    const projectTitle = document.querySelector('.project-title');
    projectTitle.textContent = `${project.getName()}:`;

    const description = document.querySelector('.project-description');
    description.textContent = project.getDescription();

    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    (Storage.getDashboard()).getProject(project.getName()).getTasks().forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-element');

        const priority = document.createElement('img');
        priority.classList.add('task-priority');

        switch (task.priority){
            case ('high'):
                priority.src = highPriority;
                break;
            case ('medium'):
                priority.src = mediumPriority;
                break;
            case ('low'):
                priority.src = lowPriority;
                break;
            default:
                priority.src = nonePriority;
        }

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.classList.add('task-check');

        check.addEventListener('click', () => completeTask(task, project));

        const taskTitle = document.createElement('p');
        taskTitle.classList.add('task-title');
        if (project.getName() === 'home' || project.getName() === 'today' || project.getName() === 'this week'){ 
            taskTitle.textContent = `${task.getName()} (${task.getProject()})`
        } else {
            taskTitle.textContent = task.getName();
        }

        if(task.getCompleteStatus() === true){
            taskTitle.style.textDecoration = "line-through";
            check.checked = true;
        } else {
            taskTitle.style.textDecoration = "none";
            check.checked = false;
        }

        const dueDate = document.createElement('p');
        dueDate.classList.add('due-date');
        dueDate.textContent = task.getDateFormatted();

        const editTask = document.createElement('img');
        editTask.classList.add('three-dots');
        editTask.src = threeDots;

        editTask.addEventListener('click', () => editTaskProperties(task, taskElement));

        const deleteButton = document.createElement('p');
        deleteButton.innerHTML = `&#x2716;`;
        deleteButton.classList.add('delete-task-button');

        deleteButton.addEventListener('click', () => deleteTask(task));

        taskElement.appendChild(check);
        taskElement.appendChild(taskTitle);
        taskElement.appendChild(priority);
        taskElement.appendChild(dueDate);
        taskElement.appendChild(editTask);
        taskElement.appendChild(deleteButton);

        taskContainer.appendChild(taskElement);
    });

    currentProject = project;
    const currentLocalPage = localStorage.getItem('currentPage');

    if (currentProject && currentProject != todayProject && currentProject != thisWeekProject && currentLocalPage != "today" && currentLocalPage != "this week"){
        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = '+ add task';
        addTaskButton.classList.add('add-task-button');
        
        addTaskButton.addEventListener('click', () => addNewTask(currentProject));
        
        taskContainer.appendChild(addTaskButton);
    }
    
    if (currentProject && currentProject != todayProject && currentProject != thisWeekProject && currentProject != homeProject && currentLocalPage != "today" && currentLocalPage != "this week" && currentLocalPage != "home"){
        const deleteProject = document.createElement('button');
        deleteProject.classList.add('delete-project');
        deleteProject.textContent = 'delete project';
        deleteProject.addEventListener('click', () => deleteProjectPage(currentProject));
        
        content.appendChild(deleteProject);
    }
}

function displayAddProjectForm() {
    const projectTitle = document.querySelector('.project-title');
    projectTitle.textContent = "create new project";

    if (document.querySelector('.delete-project')) {
        document.querySelector('.delete-project').remove();
    }
    
    const description = document.querySelector('.project-description');
    description.textContent = '';

    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    const projectForm = document.createElement('form');
    projectForm.classList.add('project-form');

    const nameInput = document.createElement('input');
    nameInput.placeholder = "project name";
    nameInput.classList.add('project-name');
    nameInput.required = true;

    const createButton = document.createElement('button');
    createButton.textContent = "create";
    createButton.classList.add('project-create-button');
    createButton.type = 'submit';

    const projectDesc = document.createElement('textarea');
    projectDesc.placeholder = "project description (optional)";
    projectDesc.classList.add('project-desc');

    projectForm.appendChild(nameInput);
    projectForm.appendChild(projectDesc);
    projectForm.appendChild(createButton);

    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newProject = new Project(nameInput.value, projectDesc.value);

        // Update the sidebar with the new project
        const pageList = document.querySelector('#project-list');
        const projectButton = document.createElement('button');
        projectButton.classList.add('tab-button');
        projectButton.textContent = newProject.getName();
        projectButton.addEventListener('click', () => {
            localStorage.setItem('currentProject', newProject.getName());
            displayTasks(newProject)
        });
        pageList.appendChild(projectButton);

        Storage.addProject(newProject);

        displayTasks(newProject);
        projectForm.remove();
    });

    taskContainer.appendChild(projectForm);
}


function addNewTask(project){
    const app = document.querySelector('#app');

    const taskContainer = document.querySelector('.task-container');
    
    const addTaskButton = document.querySelector('.add-task-button');
    addTaskButton.style.display = 'none';

    const addTaskForm = document.createElement('form');
    addTaskForm.classList.add('add-task-form');

    const taskName = document.createElement('input');
    taskName.type = "input";
    taskName.classList.add('task-name-input');
    taskName.placeholder = 'task name';
    taskName.required = true;

    const taskDate = document.createElement('input');
    taskDate.type = 'date';
    taskDate.classList.add('task-date-input');
    taskDate.required = true;

    const priority = document.createElement('select');
    priority.classList.add('priority-select');
    priority.name = 'priority';

    const none = document.createElement('option');
    const high = document.createElement('option');
    const medium = document.createElement('option');
    const low = document.createElement('option');


    none.classList.add('priority-option');
    high.classList.add('priority-option');
    medium.classList.add('priority-option');
    low.classList.add('priority-option');

    none.textContent = 'select priority';
    high.textContent = 'high';
    medium.textContent = 'medium';
    low.textContent = 'low';

    priority.appendChild(none);
    priority.appendChild(high);
    priority.appendChild(medium);
    priority.appendChild(low);

    const submitTask = document.createElement('button');
    submitTask.textContent = "add task";
    submitTask.classList.add('submit-task');
    submitTask.type = 'submit';

    addTaskForm.appendChild(taskName);
    addTaskForm.appendChild(priority);
    addTaskForm.appendChild(taskDate);
    addTaskForm.appendChild(submitTask);

    taskContainer.appendChild(addTaskForm);
    
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    overlay.onclick = function () {
        addTaskButton.style.display = 'block';
        addTaskForm.remove();
        overlay.remove();
    }

    submitTask.addEventListener('click', function(event) {
        event.preventDefault();
        if (taskName.value.trim() && taskDate.value){
            const selectedPriority = priority.value === 'select priority' ? 'none' : priority.value;
            const newTask = new Task(taskName.value, taskDate.value, selectedPriority, project.getName(), false);

            Storage.addTask(project.getName(), newTask);
            
            displayTasks(project);

            Storage.updateHomeProject();
            Storage.updateTodayProject();
            Storage.updateWeekProject();

            addTaskButton.style.display = 'block';
            addTaskForm.remove();
            overlay.remove();
            
        } else if (taskName.value.trim()){
            const selectedPriority = priority.value === 'select priority' ? 'none' : priority.value;
            const newTask = new Task(taskName.value, new Date(), selectedPriority, project.getName(), false);

            Storage.addTask(project.getName(), newTask);
            
            displayTasks(project);
            
            Storage.updateHomeProject();
            Storage.updateTodayProject();
            Storage.updateWeekProject();
            
            addTaskButton.style.display = 'block';
            addTaskForm.remove();
            overlay.remove();
            
        } 
        else {
            alert("please fill out the fields");
        }
    })


    app.appendChild(overlay);
}

function editTaskProperties(task, taskElement) {
    // Create the form
    const addTaskForm = document.createElement('form');
    addTaskForm.classList.add('add-task-form');

    const taskName = document.createElement('input');
    taskName.type = "input";
    taskName.classList.add('task-name-input');
    taskName.value = task.getName();
    taskName.required = true;

    const taskDate = document.createElement('input');
    taskDate.type = 'date';
    taskDate.classList.add('task-date-input');
    taskDate.value = task.getDate();
    taskDate.required = true;

    const priority = document.createElement('select');
    priority.classList.add('priority-select');
    priority.name = 'priority';

    const none = document.createElement('option');
    none.textContent = 'select priority';
    none.value = '';

    const high = document.createElement('option');
    high.textContent = 'high';
    high.value = 'high';

    const medium = document.createElement('option');
    medium.textContent = 'medium';
    medium.value = 'medium';

    const low = document.createElement('option');
    low.textContent = 'low';
    low.value = 'low';

    priority.appendChild(none);
    priority.appendChild(high);
    priority.appendChild(medium);
    priority.appendChild(low);

    priority.value = task.getPriority();

    const submitTask = document.createElement('button');
    submitTask.textContent = "done";
    submitTask.classList.add('submit-task');
    submitTask.type = 'submit';

    addTaskForm.appendChild(taskName);
    addTaskForm.appendChild(taskDate);
    addTaskForm.appendChild(priority);
    addTaskForm.appendChild(submitTask);

    // Replace the task element's inner HTML with the form
    taskElement.innerHTML = '';
    taskElement.appendChild(addTaskForm);

    submitTask.addEventListener('click', function(event) {
        event.preventDefault();

        const taskProjectName = task.getProject();
        const taskProject = Storage.getDashboard().getProject(taskProjectName);
        let actualTask = taskProject.getTask(task.getName());
        
        // Update the task with the new values
        Storage.setTaskDate(taskProjectName, actualTask.getName(), taskDate.value);
        Storage.setTaskpriority(taskProjectName, actualTask.getName(), priority.value);
        Storage.renameTask(taskProjectName, actualTask.getName(), taskName.value);

        Storage.updateHomeProject();
        Storage.updateTodayProject();
        Storage.updateWeekProject();

        // Refresh the display of tasks
        displayTasks(currentProject);
    });
}

function completeTask(task, project) {
    const completed = task.getCompleteStatus();
    const taskProjectName = task.getProject();
    const taskProject = Storage.getDashboard().getProject(taskProjectName);

    // Update the task in the actual project
    const actualTask = taskProject.getTask(task.getName());
    actualTask.setCompleteStatus(!completed);
    Storage.setTaskComplete(taskProject.getName(), actualTask.getName(), !completed);

    // Update the special projects
    Storage.updateHomeProject();
    Storage.updateTodayProject();
    Storage.updateWeekProject();

    // Refresh the display of tasks
    displayTasks(project);
}



function deleteTask(task){
    const taskProjectName = task.getProject();

    Storage.deleteTask(taskProjectName, task.getName());
    
    Storage.updateHomeProject();
    Storage.updateTodayProject();
    Storage.updateWeekProject();

    displayTasks(currentProject);
}

function dateToString(dateString){
    const date = new Date(dateString);

    const options = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDate;
}

function deleteProjectPage(project){
    const content = document.querySelector('#content')

    Storage.deleteProject(project.getName());

    content.innerHTML='';
    displayUI();
}

export {displayUI, currentProject};
