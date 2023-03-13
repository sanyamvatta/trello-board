const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const ArrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  ArrayNames.forEach(function (name,index) {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}

function filterArray(array){
  const filteredArray = array.filter((item)=> item!==null)
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable=true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.setAttribute('onfocusin','focusin(event)');
  listEl.id = index
  listEl.setAttribute('onfocusout',`updateItem(${index},${column})`);
  columnEl.appendChild(listEl);
}
// update our item or delete and update the array value
function updateItem(id,column){
  if(!dragging){
    let selectedArray = listArrays[column];
    const selectedColumnEl = itemLists[column].children
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id]
    }else{
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM();
  }
}
// When Item starts dragging
function drag(e){
  draggedItem = e.target;
  console.log(draggedItem)
  dragging = true;
}

// when item enters column area
function dragEnter(column){
  itemLists[column].classList.add('over')
  currentColumn = column
}


// drop function
function allowDrop(e){
  e.preventDefault()
}

// dropping item
function drop(e){
  e.preventDefault();
  // remove the padding
  itemLists.forEach((column)=>{
    column.classList.remove('over')
  })
  // Add item to the column
  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays()
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray)
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray)


  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray)


  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index)=>{
    createItemEl(onHoldList, 3, onHoldItem, index); 
  });
  onHoldListArray = filterArray(onHoldListArray)

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns()
}

// add to column list
function addToColumn(column){
  const itemText = addItems[column].textContent
  if(itemText){
    const selectedArray = listArrays[column]
    selectedArray.push(itemText)
    updateDOM()
    addItems[column].textContent = ''
  }
}


function showInputBox(column){
  addBtns[column].style.visibility  = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

function hideInputBox(column){
  addBtns[column].style.visibility  = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}


function rebuildArray(array,el){
  array=[]
  for(let i=0;i<el.children.length;i++){
    array.push(el.children[i].textContent);
  }
}

// allow arrays to reflect drag and drop
function rebuildArrays(){
  rebuildArray(backlogListArray,backlogList)
  rebuildArray(progressistArray,progressist)
  rebuildArray(completeListArray,completeList)
  rebuildArray(onHoldListArray,onHoldList)
  updateDOM()
}
// onload


updateDOM()

