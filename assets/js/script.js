//Grab references to the important DOM elements.
const timeDisplayEl = $('#time-display');
const projectDisplayEl = $('#project-display');
const projectFormEl = $('#project-form');
const projectNameInputEl = $('#project-name-input');
const projectTypeInputEl = $('#project-type-input');
const projectDateInputEl = $('#taskDueDate');

function readProjectsFromStorage() {
  
    //Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
    const storageArray = JSON.parse(localStorage.getItem("tasks"));
    if (storageArray) {
      return storageArray
    } else {
      const emptyArray = [];
      return emptyArray
    }
  
}
// Function for creating a single task card
function createTaskCard(project) {
  const taskCard = $('<div>');
  taskCard.addClass('card project-card draggable my-3');
  taskCard.attr('data-project-id', project.id);
  //Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
  const cardHeader = $('<div>');
  cardHeader.addClass('card-header h4');
  cardHeader.text(project.name); 
  //Create a new card body element
  const cardBody = $('<div>');
  cardBody.addClass('card-body');
  //Create a new paragraph element for the project description
  const cardType = $('<p>');
  cardType.addClass('card-text');
  cardType.text(project.type);
  //Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
  const cardDate = $('<p>');
  cardDate.addClass('card-text');
  cardDate.text(project.dueDate);
  //Create a new button element for the delete button
  const cardDeleteBtn = $('<button>');
  cardDeleteBtn.addClass('btn btn-danger delete');
  cardDeleteBtn.text('Delete');
  cardDeleteBtn.attr('data-project-id', project.id);

  cardDeleteBtn.on('click', handleDeleteTask);

  //Sets the card background color based on due date if the task is not done
  if (project.dueDate && project.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

    //If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  //Append the card description, card due date, and card delete button to the card body.
  cardBody.append(cardType, cardDate, cardDeleteBtn);
  //Append the card header and card body to the card.
  taskCard.append(cardHeader, cardBody);
  return taskCard;
}

// Functino to render all tasks
function renderTaskList() {
    const projects = readProjectsFromStorage();

    //Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // Create project cards for each status
    for (let project of projects) {
      const projectCard = createTaskCard(project);
      if (project.status === 'to-do') {
        todoList.append(projectCard);
      }
      else if (project.status === 'done') {
        doneList.append(projectCard);
      } 
      else if (project.status === 'in-progress') {
        inProgressList.append(projectCard);
      }
    }
  
    //Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      //Create clone of card which is dragged
      helper: function (e) {
        //Check if the target of the drag event is the card itself or a child element. 
        //If it is the card itself, clone it, otherwise find the parent card that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        //Return the clone with the width set to the width of the original card.
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
}

// Event handler for adding a task
function handleAddTask(event){
  event.preventDefault();

  //Get the project name, type, and due date from the form
  const projectName = projectNameInputEl.val().trim();
  const projectDate = projectDateInputEl.val();
  const projectType = projectTypeInputEl.val();
  //Create a new project object with the data from the form
  const newProject = {
    id: crypto.randomUUID(),
    name: projectName,
    type: projectType,
    dueDate: projectDate,
    status: 'to-do',
  };

  //Pull the projects from localStorage and push the new project to the array
  const projects = readProjectsFromStorage();
  projects.push(newProject);

  //Save the updated projects array to localStorage
  localStorage.setItem('tasks', JSON.stringify(projects));

  //Print project data back to the screen
  renderTaskList();

  //Clear the form inputs
  projectDateInputEl.val('');
  projectNameInputEl.val('');
  projectTypeInputEl.val('');
}

//Handler for delete button press
function handleDeleteTask(event){
  const projectId = $(this).attr('data-project-id');
  const projects = readProjectsFromStorage();

  //Loop through the projects array and remove the project with the matching id.
  projects.forEach((project, index) => {
    if (project.id === projectId) {
      projects.splice(index, 1);
    }
  })

  localStorage.setItem('tasks', JSON.stringify(projects));
  //print remaining projects to the screen
  renderTaskList();
}

//Handler for dropping a task card
function handleDrop(event, ui) {
  //Read projects from localStorage
  const projects = readProjectsFromStorage();

  //Get the project id from the event
  const taskId = ui.draggable[0].dataset.projectId;
  console.log(ui.draggable[0]);
  //Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let project of projects) {
    //Find the project card by the `id` and update the project status.
    if (project.id === taskId) {
      project.status = newStatus;
    }
  }
  //Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem('tasks', JSON.stringify(projects));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  projectFormEl.on('submit', handleAddTask);
  projectDisplayEl.on('click', '.btn-delete-project', handleDeleteTask);
  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});
