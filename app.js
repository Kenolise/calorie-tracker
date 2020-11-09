/* STORAGE CONTROLLER
-----------------------*/
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      items.push(item);
      // Set local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    getItemsFromStorage: function(){
      let items = [];
      if(localStorage.getItem('items') === null){
        items =[];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (updatedItem.id === item.id){
          items.splice(index, 1, updatedItem); // 3rd parameter of splice is what we want to update the spliced content with
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (id === item.id){
          items.splice(index, 1); // 3rd parameter of splice is what we want to update the spliced content with
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



/* ITEM CONTROLLER
-----------------------*/
const ItemCtrl = (function(){
  
  // Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){

      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id +1
      } else {
        ID = 0;
      }

      // Calories as number
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(ID, name, calories);
      // Add to data.items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item){
        if (item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      // Gets ids (using map method)
      ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      // Loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();




/* UI CONTROLLER
-----------------------*/
const UICtrl = (function(){

  // Object to hold all of the UI selectors
  const UISelectors = {
    itemList: document.querySelector('#item-list'),
    listItems: '#item-list li', // These items change in the DOM, so must be called new each time
    addBtn: document.querySelector('.add-btn'),
    updateBtn: document.querySelector('.update-btn'),
    deleteBtn: document.querySelector('.delete-btn'),
    backBtn: document.querySelector('.back-btn'),
    clearBtn: document.querySelector('.clear-btn'),
    itemNameInput: document.querySelector('#item-name'),
    itemCaloriesInput: document.querySelector('#item-calories'),
    totalCalories: document.querySelector('.total-calories')
  }
  
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      
      // Insert list items
      UISelectors.itemList.innerHTML = html;

    },
    getItemInput: function(){
      return {
        name: UISelectors.itemNameInput.value,
        calories: UISelectors.itemCaloriesInput.value
      }
    },
    addListItem: function(item){
      // Show list
      UISelectors.itemList.style.display = 'block';

      // Create li elemt
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      // Insert item into DOM
      UISelectors.itemList.insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list into array
      listItems = Array.from(listItems);
      // console.log(listItems);
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function(){
      UISelectors.itemNameInput.value = '';
      UISelectors.itemCaloriesInput.value = '';
    },
    addItemToForm: function(){
      UISelectors.itemNameInput.value = ItemCtrl.getCurrentItem().name;
      UISelectors.itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;
      // Get Edit state
      UICtrl.showEditState();
    },
    removeListItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to array
      listItems = Array.from(listItems);
      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      UISelectors.itemList.style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      UISelectors.totalCalories.textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      UISelectors.updateBtn.style.display = 'none';
      UISelectors.deleteBtn.style.display = 'none';
      UISelectors.backBtn.style.display = 'none';
      UISelectors.addBtn.style.display = 'inline';
    },
    showEditState: function(){
      UISelectors.updateBtn.style.display = 'inline';
      UISelectors.deleteBtn.style.display = 'inline';
      UISelectors.backBtn.style.display = 'inline';
      UISelectors.addBtn.style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();




/* APP CONTROLLER
-----------------------*/
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  // Load Event Listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    
    // Add item event
    UISelectors.addBtn.addEventListener('click', itemAddSubmit);
    
    // Edit icon click event
    UISelectors.itemList.addEventListener('click', itemEditClick);

    // Update item event
    UISelectors.updateBtn.addEventListener('click', itemUpdateSubmit);

    // Delete item event
    UISelectors.deleteBtn.addEventListener('click', itemDeleteSubmit);

    // Back Button event
    UISelectors.backBtn.addEventListener('click', itemEditCancel);

    // Clear All event
    UISelectors.clearBtn.addEventListener('click', clearAllItemsClick);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){ // If 'enter' was pressed on keyboard
        e.preventDefault();
        return false;
      }
    })
  };

  
  
  // Add item submit
  const itemAddSubmit = function(e){
    
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    
    // Check that fields are filled
    if (input.name !== '' && input.calories !== '') {
      
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total to UI
      UICtrl.showTotalCalories(totalCalories);

      // Add to storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };


  // Edit item click
  const itemEditClick = function(e){
    e.preventDefault();
    //  Check that the edit icon is what was clicked
    if (e.target.classList.contains('edit-item')){
      
      // Get list item ID
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArray = listId.split('-');
      // Get actual id
      const id = parseInt(listIdArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
  }

  // Update edit submit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

  };


  // Delete button event
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Remove from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
  };
  

  // Cancel editing item (Back button)
  const itemEditCancel = function(e){
    e.preventDefault();
    UICtrl.clearEditState();
  };

  
  // Clear All items event
  const clearAllItemsClick = function(e){
    e.preventDefault()
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total to UI
    UICtrl.showTotalCalories(totalCalories);
    
    // Remove from UI
    UICtrl.removeListItems();

    // Clear from local storage
    StorageCtrl.clearAllFromStorage();

    // Hide List ul
    UICtrl.hideList();

    UICtrl.clearEditState();
  }; 



  // Public methods
  return {
    //  This function will setup the application when it starts.
    init: function() {
      // Clear edit state / Set Inital State
      UICtrl.clearEditState();
      
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items exist
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items - using UICtrl
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);




// Initialize App
App.init();