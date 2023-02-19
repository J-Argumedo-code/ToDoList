const add = document.getElementById("agregar"),
tasks = document.getElementById("tareas"),
sectionAdd = document.getElementById("insert-data"),
sectionTasks = document.getElementById("tasks"),
addTaskSection = document.getElementById("add-task");

const okCorrectButton = document.getElementById("ok-correct"),
okWrongButton = document.getElementById("ok-wrong"),
yesQuestionButton = document.getElementById("btn-question-yes"),
noQuestionButton = document.getElementById("btn-question-no"),
correctAlert = document.getElementById("correct-alert"),
wrongAlert = document.getElementById("wrong-alert"),
questionAlert = document.getElementById("question-alert"),
overlay = document.getElementById("overlay");

const title = document.getElementById("title"),
time = document.getElementById("time"),
priority = document.querySelectorAll("input[name=priority]"),
description = document.getElementById("descripcion");

const btn = document.getElementById("submit");

//Dropdown
const select = document.getElementById("order")

//Dropdpwn delete
const deleteLabel = document.getElementById("delete-label")
const delete1 = document.getElementById("delete-one")
const delete2 = document.getElementById("delete-all")
const cancel = document.getElementById("cancel")


let date = "";
let counter = 0;
let classPriority = "";



//Load screen
window.addEventListener("load", function(){
    overlay.style.filter = "opacity(0%)"
    setTimeout(quiteOverlay, 2000)
})
function quiteOverlay(){
    overlay.classList.add("quite")
    overlay.style.filter = "opacity(90%)"
}

//Navbar
add.addEventListener("click", function(){
    sectionAdd.classList.remove("quite");
    sectionTasks.classList.add("quite");
    let lastTask = document.querySelectorAll(".task")
    if(lastTask.length>0){
        lastTask[lastTask.length-1].classList.remove("last");
    }    
})

deleteLabel.addEventListener("click", function(e){
    e.preventDefault()
})
deleteLabel.addEventListener("mouseover", function(){
    deleteLabel.setAttribute("open", "")
})
deleteLabel.addEventListener("mouseleave", function(){
    deleteLabel.removeAttribute("open")
})

//Identify last element
function lastElement(){
    let lastTask = document.querySelectorAll(".task")
    if(lastTask.length%2===0){}else{
        lastTask[lastTask.length-1].classList.add("last");
    }
}
tasks.addEventListener("click", function(){
    sectionAdd.classList.add("quite");
    sectionTasks.classList.remove("quite")
    lastElement()
})

//Alerts
okCorrectButton.addEventListener("click", function(){
    overlay.classList.add("quite")
    correctAlert.classList.add("quite")
    correctAlert.style.transform = "scale(0.9)"
    correctAlert.style.opacity = "0"
    correctAlert.children[1].innerHTML = "Tarea agregada correctamente."

    //Quite delete option
    quiteDeleteOption()
})
okWrongButton.addEventListener("click", function(){
    overlay.classList.add("quite")
    wrongAlert.classList.add("quite")
    wrongAlert.style.transform = "scale(0.9)"
    wrongAlert.style.opacity = "0"
    wrongAlert.children[1].innerHTML = "Error. Por favor completa todos los campos."
})



//Add a task
class taskList {
  constructor(title, time, description) {
    this.title = title;
    this.time = time;
    if(priority[0].checked){
        this.priority = "Alta"
        this.classPriority = "high"
    } else if(priority[1].checked){
        this.priority = "Media"
        this.classPriority = "medium"
    }else{
        this.priority = "Baja"
        this.classPriority = "low"
    }
    this.description = description
    this.date = "2021-12-12 " + time;
    this.counter = counter
  }
}

const addTask = (div, { title, time, priority, description, classPriority, counter}) => {
  div.innerHTML += `
    <article class="task" id="${counter}">
        <div class="select quite">Toca un registro para eliminarlo</div>
        <div class="top ${classPriority}">
            <h3>${priority}</h3>
            <h3>${time}</h3>
        </div>
        <div class="contain">
            <h2>${title}</h2>
            <h4>${description}</h4>
        </div>
    </article>
  `;
};

const validate = (title, description) => {
  return title.trim() && description.trim();
};

const clearInput = () => {
  title.value = null;
  description.value = null;
  time.value = "";
  priority.forEach((item) => (item.checked = false));
};

let re = /([01]?[0-9]|2[0-3]):([0-5][0-9])/;
let data = [];
let dataM = []

btn.addEventListener("click", () => {
  if (validate(title.value, description.value) && re.test(time.value) && (priority[0].checked || priority[1].checked || priority[2].checked)){
    correctAlert.classList.remove("quite")
    overlay.classList.remove("quite")
    setTimeout(appear,200)
    const tasklist = new taskList(
        title.value,
        time.value,
        description.value
      );
    addTask(addTaskSection, tasklist);
    
    data.push(tasklist)
    clearInput();

    //Guardar en localStorage
    localStorage.setItem("task" + counter, JSON.stringify(tasklist));
    counter ++
    localStorage.setItem("counter", counter);
  }else{
    wrongAlert.classList.remove("quite")
    overlay.classList.remove("quite")
    setTimeout(appear,200)
  }
});

function appear(){
    correctAlert.style.transform = "scale(1)"
    wrongAlert.style.transform = "scale(1)"
    questionAlert.style.transform = "scale(1)"
    correctAlert.style.opacity = "1"
    wrongAlert.style.opacity = "1"
    questionAlert.style.opacity = "1"
}



//Filters
function deleteAllData(){
    let lastTask = document.querySelectorAll(".task")
    lastTask.forEach(array => {
        let padre = array.parentNode;
        padre.removeChild(array)
    });
}
function showNewData(){
    for (let i = 0; i < dataM.length; i++) {
        addTask(addTaskSection, dataM[i])           
    }
}
function reorganiceTime(){
    dataM.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    showNewData()
}



select.addEventListener("click", function(){
    quiteDeleteOption()
    deleteAllData()
    dataM = []
    switch (select.selectedIndex) {
        case 0:
            for (let i = 0; i < data.length; i++) {
                addTask(addTaskSection, data[i])           
            }
            break;
        case 1:
            dataM = data.slice();
            reorganiceTime()
            break;
        case 2:
            dataM = data.filter(priority => priority.classPriority === "high");
            reorganiceTime()
            dataM = data.filter(priority => priority.classPriority === "medium");
            reorganiceTime()
            dataM = data.filter(priority => priority.classPriority === "low");
            reorganiceTime()
            break;
        case 3:
            dataM = data.filter(priority => priority.classPriority === "low");
            reorganiceTime()
            dataM = data.filter(priority => priority.classPriority === "medium");
            reorganiceTime()
            dataM = data.filter(priority => priority.classPriority === "high");
            reorganiceTime()
            break;
        case 4:
            dataM = data.filter(priority => priority.classPriority === "high");
            reorganiceTime()
            break;
        case 5:
            dataM = data.filter(priority => priority.classPriority === "medium");
            reorganiceTime()
            break;
        case 6:
            dataM = data.filter(priority => priority.classPriority === "low");
            reorganiceTime()
            break;
    }
    lastElement()
})


//Delete options
let param = 0;
let num = 0;

delete1.addEventListener("click", function(){
    param = true
    deleteLabel.removeAttribute("open")
    const elements = document.getElementsByClassName("select")
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("quite")

        let id = elements[i].parentNode.getAttribute("id")
        elements[i].addEventListener("click", function(){
            deleteElement(id)
        })
    }
    cancel.classList.remove("quite");
    delete2.classList.add("quite")
})
function deleteElement(numParam){
    num = numParam
    if(param === true){
        questionAlert.classList.remove("quite")
        overlay.classList.remove("quite")
        setTimeout(appear,200)
    }
}
yesQuestionButton.addEventListener("click", function(){
    if(param === true){
        const found = data.findIndex(element => element.counter === num)
        data.splice(found, 1)
        let task = document.getElementById(num)
        let padre = task.parentNode;
        padre.removeChild(task);
        localStorage.removeItem("task"+num);
    }else{
        deleteAllData()
        data = []
        counter = 0
        localStorage.clear()
    }

    quiteQuestion()
    correctAlert.classList.remove("quite")
    overlay.classList.remove("quite")
    setTimeout(appear,200)
    correctAlert.children[1].innerHTML = "Registro/s eliminado correctamente."
})
noQuestionButton.addEventListener("click", function(){
    quiteQuestion()
    quiteDeleteOption()
})

function quiteQuestion(){
    overlay.classList.add("quite")
    questionAlert.classList.add("quite")
    questionAlert.style.transform = "scale(0.9)"
    questionAlert.style.opacity = "0"
}


delete2.addEventListener("click", function(){
    deleteLabel.removeAttribute("open")
    overlay.classList.remove("quite")
    if(data.length > 0){
        questionAlert.classList.remove("quite")
        setTimeout(appear,200)
    }else{
        wrongAlert.classList.remove("quite")
        setTimeout(appear,200)
        wrongAlert.children[1].innerHTML = "Error. No hay registros."
    }
})


cancel.addEventListener("click", function(){
    quiteDeleteOption();
})
function quiteDeleteOption(){
    const elements = document.getElementsByClassName("select")
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("quite")
    }
    param = false;
    cancel.classList.add("quite");
    delete2.classList.remove("quite")
}



//Restorage data from localStorage
if(localStorage.length > 0){
    counter = localStorage.getItem("counter")
    const found = Object.keys(localStorage)
    for (let i = 0; i < localStorage.length; i++) {
        if (found[i] !== "counter" && found[i].includes("task")) {
            let data2 = JSON.parse(localStorage.getItem(found[i]));
            addTask(addTaskSection, data2)
            data.push(data2)
        }
    }
}





/*
let timeInt = [];
function reorganiceTime(array){
    //Pasar tiempo a entero para comparar
    for (let i = 0; i < array1.length; i++) {
        let pieces = array1[i].time.split(':')
        let timeParse = parseInt(pieces[0])+ pieces[1]/100
        timeInt.push(timeParse)
    }
    //Ordenar array de horas
    for (let i = 0; i < timeInt.length-1; i++) {
        timeInt.sort((a, b) => a - b);
    }
    //Reordenar arrays de registros
    for (let i = 0; i < timeInt.length; i++) {
        let pieces = timeInt[i].toString().split('.')
        let index = 0;
        if (pieces[1].length === 1){
            index = pieces[0]+":"+pieces[1]+"0"
            if (pieces[0] < 10) {
                index = "0"+index
            }
        }else{
            index = pieces[0]+":"+pieces[1]
        }
        const found = data.find(element => element.time === index);
        dataM.push(found)
    }    
}*/