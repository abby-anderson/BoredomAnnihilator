//urls to use in fetches
const BASE_URL = "http://localhost:3000/saved-activities";
const activity_url = "https://www.boredapi.com/api/activity";
const saved_activities_url = "http://localhost:3000/saved-activities";
const completed_activities_url = "http://localhost:3000/completed-activities";

//variables
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
    //console.log('bored? here are some ideas:');
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

        const deleteButton = document.createElement('img');
        deleteButton.src = 'images/trash-click.png';
        deleteButton.className = 'tiny-icon trash-image pushingtotheside';
        newLi.prepend(deleteButton);
        deleteButton.addEventListener('click', deleteActivity);
        deleteButton.addEventListener('mouseover', () => {
            deleteButton.src = 'images/trash-mouseover.png'
        })
        deleteButton.addEventListener('mouseout', () =>{
            deleteButton.src = 'images/trash-click.png'
        })

        const doneButton = document.createElement('img');
        doneButton.src= 'images/check-click.png';
        doneButton.className = 'check-image pushingtotheside';
        newLi.prepend(doneButton);
        doneButton.addEventListener('mouseover', () => {
            doneButton.src = 'images/check-mouseover.png'
        })
        doneButton.addEventListener('mouseout', () => {
            doneButton.src = 'images/check-click.png'
        })
        doneButton.addEventListener('click', (event) => {
            completeActivity(event)
            party.confetti(event, {
                shapes: ["star"],
                gravity: 75
            })
        });

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
    
    const saveButton = document.createElement('img');
    saveButton.src = 'images/heart.png'
    saveButton.className = 'heart-image pushingtotheside';
    newLi.prepend(saveButton);
    saveButton.addEventListener('click', selectActivity);
    saveButton.addEventListener('mouseover', () => {
        saveButton.src = 'images/heart-mouseover.png'
    })
    saveButton.addEventListener('mouseout', () => {
        saveButton.src = 'images/heart.png'
    })

    const deleteButton = document.createElement('img');
    deleteButton.src = 'images/trash-click.png';
    deleteButton.className = 'trash-image pushingtotheside';
    newLi.prepend(deleteButton);
    deleteButton.addEventListener('click', deleteActivity);
    deleteButton.addEventListener('mouseover', () => {
        deleteButton.src = 'images/trash-mouseover.png'
    })
    deleteButton.addEventListener('mouseout', () =>{
        deleteButton.src = 'images/trash-click.png'
    })

}

let selectActivity = (event) => {
    //this function is to actually handle the selection of activities so that they can be saved on submit later
    //it is called on click event when the save button on a list item is clicked
    //applied to save button inside render function
    //saveButton.addEventListener('click', selectActivity);
    event.preventDefault();
    const selectedActivity = event.target.parentNode;
    selectedActivity.className = 'selected-list-element';
    //console.log(event.target.parentNode);
    formList.append(selectedActivity);
}

let saveActivity = (event) => {
    //this function saves specific selected activities to a local db list
    //called on submit event when the name of a list is saved
    //by submitForm.addEventListener('submit', saveActivity);
    event.preventDefault();
    
    const newListName = document.querySelector("input#list-name-input").value;

    let listNodes = document.querySelectorAll('.selected-list-element');

    const listArray = [...listNodes];
    let newListArray = listArray.map(element => element.lastChild.textContent);

    // creating a new object to save to the local db
    const newListSavedObj = {
        name: newListName, 
        activities: newListArray,//selected list element
    }
    
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

    //also moving the whole list to the new section and remove the elements from the middle
    renderSavedActivities(newListSavedObj);
    formList.innerHTML = '';
}
    
let deleteActivity = (event) => {
    //this funtion deletes activities off of a list
    event.target.parentNode.remove();
    
    //would like to also add a section of this regarding DELETE fetch, so that we can delete items that were saved to a local db list --maybe would be in a separate function just for separation of concerns
}

let completeActivity = (event) => {
    //this function will be called when you click on the done button, and it will both move the list item on the dom to the completed activities div, and it will save the list item to a list of completed activities on the local db
    //doneButton.addEventListener('click', completeActivity);
    const completedActivity = event.target.parentNode;
    completedActivity.className = 'completed-list-element';

    //selecting the activity within completedActivity
    const spanText = completedActivity.lastChild.textContent

    renderCompletedActivities(spanText);
    completedActivity.remove();

    //making new obj for post request
    const newListCompletedObj = {
        activity: spanText
    }
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

    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    newSpan.textContent = newActivity;
    newLi.className = 'new-list-element';
    newLi.appendChild(newSpan);
    listContainer.appendChild(newLi);
    
    const saveButton = document.createElement('img');
    saveButton.src = 'images/heart.png'
    saveButton.className = 'heart-image pushingtotheside';
    newLi.prepend(saveButton);
    saveButton.addEventListener('click', selectActivity);
    saveButton.addEventListener('mouseover', () => {
        saveButton.src = 'images/heart-mouseover.png'
    })
    saveButton.addEventListener('mouseout', () => {
        saveButton.src = 'images/heart.png'
    })

    const deleteButton = document.createElement('img');
    deleteButton.src = 'images/trash-click.png';
    deleteButton.className = 'trash-image pushingtotheside';
    newLi.prepend(deleteButton);
    deleteButton.addEventListener('click', deleteActivity);
    deleteButton.addEventListener('mouseover', () => {
        deleteButton.src = 'images/trash-mouseover.png'
    })
    deleteButton.addEventListener('mouseout', () =>{
        deleteButton.src = 'images/trash-click.png'
    })

    const doneButton = document.createElement('img');
    doneButton.src= 'images/check-click.png';
    doneButton.className = 'check-image pushingtotheside';
    newLi.prepend(doneButton);
    doneButton.addEventListener('mouseover', () => {
        doneButton.src = 'images/check-mouseover.png'
    })
    doneButton.addEventListener('mouseout', () => {
        doneButton.src = 'images/check-click.png'
    })
    doneButton.addEventListener('click', (event) => {
        completeActivity(event)
        party.confetti(event, {
            shapes: ["star"],
            gravity: 75
        })
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
    let activityType = event.target.value;
    
    if (activityType === 'education') {
        fetchForDropdown(type_Url + `${activityType}`)
        
    } else if (activityType === 'recreational') {
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