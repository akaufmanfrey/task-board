// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function readProjectsFromStorage() {
  
    // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
    const projectArray = JSON.parse(localStorage.getItem('storage'));
    if (projectArray) {
      return projectArray
    } else {
      const emptyArray = [];
      return emptyArray
    }
  
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    localStorage.setItem('nextId', JSON.stringify(crypto.randomUUID()));
}

// Todo: create a function to create a task card
function createTaskCard(project) {
  const taskCard = $('<div>');
  taskCard.addClass('card project-card draggable my-3');
  taskCard.attr('data-project-id', `${project.id}`);
  // TODO: Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
  const cardHeader = $('<div>');
  cardHeader.addClass('card-header h4');
  cardHeader.text(project.name); 
  // TODO: Create a new card body element and add the class `card-body`.
  const cardBody = $('<div>');
  cardBody.addClass('card-body');
  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
  const cardType = $('<p>');
  cardType.addClass('card-text');
  cardType.text(project.type);
  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
  const cardDate = $('<p>');
  cardDate.addClass('card-text');
  cardDate.text(project.dueDate);
  // TODO: Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
  const cardDeleteBtn = $('<button>');
  cardDeleteBtn.addClass('btn btn-danger delete');
  cardDeleteBtn.text('Delete');
  cardDeleteBtn.attr('data-project-id', `${project.id}`);
  cardDeleteBtn.on('click', handleDeleteProject);

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (project.dueDate && project.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // TODO: Append the card description, card due date, and card delete button to the card body.
  cardBody.append(cardType, cardDate, cardDeleteBtn);
  // TODO: Append the card header and card body to the card.
  taskCard.append(cardHeader, cardBody);
  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const projects = readProjectsFromStorage();

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // TODO: Loop through projects and create project cards for each status
    for (let project of projects) {
      const projectCard = createProjectCard(project);
      if (project.status === 'to-do') {
        todoList.append(projectCard);
      }
      if (project.status === 'done') {
        doneList.append(projectCard);
      } else {
        inProgressList.append(projectCard);
      }
    }
  
    //Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      //Create clone of card which is dragged
      helper: function (e) {
        //Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card that is draggable and clone that.
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

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
