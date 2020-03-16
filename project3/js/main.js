// When the program is loaded, use an http request to grab all of the tasks as
// well as add an event listener to the add new task button that sends the user
// input to the addTaskToList function. 
const init = () => {
    httpRequest("./php/allTasks.php", "get", loadTasks, undefined, "XML");

    document.querySelector("#addNewTask").onclick = () => {
        addTaskToList(document.querySelector("#taskDescription").value);
    }
}

// Structure for most of the http requests made.
const httpRequest = (url, method, callback, params, responseType, ) => {
    let xhr = new XMLHttpRequest();
    if(params && method == "get") {
        url += "?" + params;
    }
    xhr.open(method, url);
    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
            if(responseType == "JSON") {
                callback(JSON.parse(xhr.requestText));
            } else if (responseType == "XML") {
                callback(xhr.responseXML);
            } else {
                callback(xhr.responseText)
            }
        }
    }
    if (method == "post") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    } else {
        xhr.send(null);
    }
}

// This function will grab the tasks from database after the http request and
// format them to be sent to the createTaskDisplay function.
const loadTasks = tasks => {
    let taskNodes = tasks.getElementsByTagName("task");
        for(let i=0;i<taskNodes.length;i++) {
           let currentTask = taskNodes[i];
            let id = currentTask.getElementsByTagName("id")[0].childNodes[0].nodeValue;
            let description = currentTask.getElementsByTagName("description")[0].childNodes[0].nodeValue;
            let tasks = {"id": id, "description": description};
            tasksCollection =+ tasks;
            createTaskDisplay(tasks);
        }
}

// Create the dynamic html display for all incoming tasks.
const createTaskDisplay = tasks => {
    let taskDisplay = document.createElement("div");
    taskDisplay.setAttribute("data-task-id", tasks.id);
    taskDisplay.setAttribute("id", tasks.description);
    let trashCan = document.createElement("input");
    trashCan.setAttribute("type", "image");
    trashCan.setAttribute("src", "./img/trashCan.png");
    trashCan.setAttribute("name", "trashCan");
    trashCan.setAttribute("class", "trashCan");
    trashCan.addEventListener("click", deleteTask);    
    let individualTasks = document.createElement("p");
    individualTasks.innerHTML = tasks.description;
    individualTasks.appendChild(trashCan);
    taskDisplay.appendChild(individualTasks);
    document.body.appendChild(taskDisplay);
}

// This function will first check to see if the description that the user
// inputs already exists. If it does not, a new http request will be made (without 
// using the generic structure above because the user's description is needed to make
// sure only the new task is added). The incoming data will be send to the 
// database as well as being formatted and sent to createTaskDisplay.
const addTaskToList = description => {
    if (document.getElementById(description)) {
        alert("This task already exisits."); 
    } else {
        let taskInputParams = `description=${description}`;
        httpRequest("./php/addTask.php", "post", addTaskToListConfirmation, taskInputParams);

        let url = "./php/allTasks.php";
        let xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4) {
                let taskNodes = xhr.responseXML.getElementsByTagName("task");
                    for(let i=0;i<taskNodes.length;i++) {
                        let currentTask = taskNodes[i];
                        let id = currentTask.getElementsByTagName("id")[0].childNodes[0].nodeValue;
                        let currentTaskDescription = currentTask.getElementsByTagName("description")[0].childNodes[0].nodeValue;
                        if (currentTaskDescription == description) {
                            let tasks = {"id": id, "description": currentTaskDescription};
                            tasksCollection =+ tasks;
                            createTaskDisplay(tasks);
                        } 
                    }
            }
        }
        xhr.send(null);
        document.querySelector('#taskDescription').value = "";
    }
    
    
 }

// This function will grab the id of the task to be deleted and send it to
// the deleteTask.php file. It will also grab the parent html node of the
// task and delete if from the display.
const deleteTask = event => {
    let currentTrash = event.currentTarget;
    let trashParagraphNode = currentTrash.parentNode;
    let trashParentNode = trashParagraphNode.parentNode;
    document.body.removeChild(trashParentNode);
    let idOfTaskToRemove = trashParentNode.getAttribute("data-task-id");
    let params = `id=${idOfTaskToRemove}`;
    httpRequest("./php/deleteTask.php", "post", deleteTaskConfirmation, params);
}

// Response confirmations from http requests
const addTaskToListConfirmation = response => {
    console.log(response);
}

const deleteTaskConfirmation = response => {
    console.log(response);
}


window.onload = init;