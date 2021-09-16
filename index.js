const BASE_URL = "http://localhost:3000/saved-activities";
const activity_url = "https://www.boredapi.com/api/activity";
const saved_activities_url = "http://localhost:3000/saved-activities";
const completed_activities_url = "http://localhost:3000/completed-activities";

const container = document.querySelector('#activity-container');
const listContainer = document.querySelector('#list-container');
const submitForm = document.querySelector('#list-name')
const realSubmitForm = document.querySelector('#save-form');
const randomButton = document.querySelector('#random-button');
const formSave = document.querySelector('form-save');
const formList = document.querySelector('#selected-activities');
const activityDropDown = document.querySelector('#activity-dropdown')
const activityListByType = document.querySelector('#activities-by-type-container')
const completedList = document.querySelector('#completed-list');
const savedLists = document.querySelector('#saved-lists');

let init = () => {
    console.log('bored? here are some ideas:');
    //fetch the completed tasks and render them to the page
    fetch(completed_activities_url)
    .then(response => response.json())
    .then(data => data.forEach(factoryCompletedActivities)) //where data is an array of objects and each is the obj

    //fetch the saved lists of tasks and render them to the page
    fetch(saved_activities_url)
    .then(response => response.json())
    .then(data => data.forEach(renderSavedActivities)) //where data is an array of objects and each is the obj

    //probs will actually just call render on both the above results!
}

let renderSavedActivities = (obj) => {
    //console.log(obj.name) 

    const listName = document.createElement('li')
    listName.textContent = obj.name
    listName.className = 'savedListTitle';

    //console.log(obj.activities) //array
    obj.activities.forEach(function(element){
        //create new list items 
        const newLi = document.createElement('li')
        newLi.textContent = element;
        //console.log(newLi);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button pushingtotheside';
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<img src="images/trash.png">';

        newLi.prepend(deleteButton);
        deleteButton.addEventListener('click', deleteActivity);

        const doneButton = document.createElement('button');
        doneButton.textContent = 'done';
        doneButton.className = 'done-button';
        doneButton.className = 'btn btn-success pushingtotheside';
        newLi.prepend(doneButton);
        doneButton.addEventListener('click', completeActivity);

        //append as children to listName
        listName.appendChild(newLi)
    })
    
    //and then append listName to the saved lists container which is called savedLists
    savedLists.appendChild(listName);
}


let factoryCompletedActivities = (obj) => {
    renderCompletedActivities(obj.activity);
}

let renderCompletedActivities = (data) => {
    const completedActivity = data;
    
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    newSpan.textContent = completedActivity;
    newLi.className = 'new-list-element';
    newLi.appendChild(newSpan);
    completedList.appendChild(newLi);
    
    const saveButton = document.createElement('button');
    saveButton.textContent = "save";
    saveButton.className = 'btn btn-primary pushingtotheside'; 
    newLi.prepend(saveButton);
    saveButton.addEventListener('click', selectActivity);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<img src="images/trash.png">';
    deleteButton.className = 'delete-button pushingtotheside';
    deleteButton.className = 'btn btn-danger';
    newLi.prepend(deleteButton);
    deleteButton.addEventListener('click', deleteActivity);

}

//called on click event when the save button on a list item is clicked
//applied to save button inside render function
//saveButton.addEventListener('click', selectActivity);
let selectActivity = (event) => {
    //this function is to actually handle the selection of activities so that they can be saved on submit
    event.preventDefault();
    const selectedActivity = event.target.parentNode;
    selectedActivity.className = 'selected-list-element';
    //console.log(event.target.parentNode);
    formList.append(selectedActivity);

 


}

//called on submit event when the name of a list is saved
//by submitForm.addEventListener('submit', saveActivity);
let saveActivity = (event) => {
    //this function saves specific selected activities to a local db list
    event.preventDefault();
    
    const newListName = document.querySelector("input#list-name-input").value;
    //console.log(newListName); //for name of newListSavedObj

    let listNodes = document.querySelectorAll('.selected-list-element');
    console.log(listNodes);
    console.log(typeof listNodes);


    const listArray = [...listNodes];
    let newListArray = listArray.map(element => element.lastChild.textContent);

    const newListSavedObj = {
        name: newListName, 
        activities: newListArray,//selected list element
    }
    // creating a new object to save to the local db
    //console.log('newListArray from map', newListArray);
    //console.log(newListSavedObj);
    
    //then do fetch request to post this to the local db
    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newListSavedObj),
    };
    
    fetch(BASE_URL, configObj)
    .then(response => response.json())
    .then(data => console.log(data));
    realSubmitForm.reset();

    //also should move the whole list to the new section and remove the elements from the middle
    renderSavedActivities(newListSavedObj);
    formList.innerHTML = '';

}
    
    let deleteActivity = (event) => {
    //this funtion deletes activities off of a list
    event.target.parentNode.parentNode.remove();
    
    //would like to also add a section of this regarding DELETE fetch, so that we can delete items that were saved to a local db list --maybe would be in a separate function just for separation of concerns
}

//already added click event to done button inside the render fxn, click event will call complete activity
//doneButton.addEventListener('click', completeActivity);
let completeActivity = (event) => {
    //this function will be called when you click on the done button, and it will both move the list item on the dom to the completed activities div, and it will save the list item to a list of completed activities on the local db
    console.log(event)
    const completedActivity = event.target.parentNode;
    completedActivity.className = 'completed-list-element';
    console.log(completedActivity);
    //would like to figure out how to remove the done button, since we're marking the item as done in this function
    
    const spanText = completedActivity.lastChild.textContent

    renderCompletedActivities(spanText);
    completedActivity.remove();

       //brainstorm - could grab span element from selected list element, delete old list element, send span element through completed activitites


    //selecting the activity within completedActivity
    //making new obj for post request
    const newListCompletedObj = {
        activity: spanText
    }
    console.log(newListCompletedObj)
    //fetch request to POST to local db
    const configCompletedObj = {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(newListCompletedObj)
    };
    fetch(completed_activities_url, configCompletedObj)
    .then(response => response.json())
    .then(data => data);
}

let renderActivity = (data) => {
    const newActivity = data;
    //console.log(newActivity);
    
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    newSpan.textContent = newActivity;
    newLi.className = 'new-list-element';
    newLi.appendChild(newSpan);
    listContainer.appendChild(newLi);
    
    const saveButton = document.createElement('button');
    saveButton.textContent = "save";
    saveButton.className = 'btn btn-primary pushingtotheside'; 
    newLi.prepend(saveButton);
    saveButton.addEventListener('click', selectActivity);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<img src="images/trash.png">';
    deleteButton.className = 'delete-button pushingtotheside';
    deleteButton.className = 'btn btn-danger';
    newLi.prepend(deleteButton);
    deleteButton.addEventListener('click', deleteActivity);
    
    const doneButton = document.createElement('button');
    doneButton.textContent = 'done';
    doneButton.className = 'done-button';
    doneButton.className = 'btn btn-success pushingtotheside';
    newLi.prepend(doneButton);
    doneButton.addEventListener('click', (event) => {
        event.preventDefault()
        completeActivity(event)
        party.confetti(event, {
            shapes: ["star"],
            gravity: 75
        })
        // party.sparkles(event)
    });
    function reset(){
        activityDropDown.selectedIndex = 0;
    }
    reset()
}

let fetchData = (url) => {
    fetch(url)
    .then(response => response.json())
    .then(data => renderActivity(data.activity))
}

let activityFactory = (event) => {
    event.preventDefault;
    fetchData(activity_url);   
}


let fetchForDropdown = (url) => {
    fetch(url)
    .then(response => response.json())
    .then(type => renderActivity(type.activity))
}

let handleChangeFactory = (event) => {
    
    let type_Url = 'http://www.boredapi.com/api/activity?type='
    
    let activityType = event.target.value
    console.log(activityType)
    
    if (activityType === 'education') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'recreation') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'social') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'diy') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'charity') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'cooking') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'relaxation') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'music') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'busywork') {
        fetchForDropdown(type_Url + `${activityType}`)
    }
}

realSubmitForm.addEventListener('submit', saveActivity);
randomButton.addEventListener('click', activityFactory);
activityDropDown.addEventListener('change', handleChangeFactory);
document.addEventListener('DOMContentLoaded', init);