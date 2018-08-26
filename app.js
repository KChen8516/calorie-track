//
// Module design pattern using IIFE's
//


// Storage Controller (LocalStorage)
const StorageCtrl = (function() {

    // Public API
    return {
        storeItem: function(item) {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            };
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateStorageItem: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteStorageItem: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items = items.filter(item => item.id !== id);
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearStorageItems: function() {
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function() {
    const item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items: [
        //     {id: 0, name: 'Steak Dinner', calories: 1200},
        //     {id: 3, name: 'Eggs', calories: 650},
        //     {id: 1, name: 'Cookie', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public API
    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            // ID creation
            let ID;
            if(data.items.length > 0) {
                // the ID of the last item + 1
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            newItem = new item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function() {
            data.totalCalories = data.items.reduce((total, item) => {return total += item.calories}, 0);
            return data.totalCalories;
        },
        getItemById: function(id) {
            return data.items.find(item => item.id === id);
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            // update data.items with the id removed
            data.items = data.items.filter(item => item.id !== id);
        },
        clearData() {
            data.items = [];
            data.currentItem = null;
            data.totalCalories = 0;
        }
    }
})();

// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        addMeal: '#btn--add-meal',
        deleteMeal: '#btn--delete',
        updateMeal: '#btn--update',
        backBtn: '#btn--back',
        clearBtn: '#navbar-btn--clear',
        itemForm: '#calorie-card--form',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    // Public API
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(item => {
                html += `
                    <li class="mdc-list-item" id="item-${item.id}">
                        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                        <span class="mdc-list-item__meta material-icons edit-item" aria-hidden="true">info</span>
                    </li>
                `
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Create the li element
            const li = document.createElement('li');
            li.className = 'mdc-list-item';
            li.id = `item-${item.id}`;

            // populate content
            li.innerHTML = `
                <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                <span class="mdc-list-item__meta material-icons edit-item" aria-hidden="true">info</span>
            `;

            // Insert into the list
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInputs: function() {
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
            document.querySelector(UISelectors.itemNameInput).value = '';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.deleteMeal).style.display = 'none';
            document.querySelector(UISelectors.updateMeal).style.display = 'none';
            document.querySelector(UISelectors.addMeal).style.display = 'block';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        editItemInForm: function() {
            // update input fields
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            // change buttons
            UICtrl.showEditState();
        },
        showEditState: function() {
            document.querySelector(UISelectors.deleteMeal).style.display = 'block';
            document.querySelector(UISelectors.updateMeal).style.display = 'block';
            document.querySelector(UISelectors.addMeal).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'block';
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll('#item-list li');

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`) {
                    document.getElementById(`${itemID}`).innerHTML = `
                        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                        <span class="mdc-list-item__meta material-icons edit-item" aria-hidden="true">info</span>
                    `;
                }
            });
        },
        removeListItem: function(id) {
            // construct the fetch id
            const itemID = `item-${id}`;
            document.getElementById(itemID).remove();
        },
        removeAllItems() {
            const listItems = document.querySelectorAll('#item-list li');

            listItems.forEach(item => item.remove());
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
    const loadEventListeners = function() {
        // Grab from the UICtrl API
        const UISelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(UISelectors.addMeal).addEventListener('click', itemAddSubmit);

        // Edit Item Event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEdit);

        // Update Item event
        document.querySelector(UISelectors.updateMeal).addEventListener('click', itemUpdate);

        // Delete Item event
        document.querySelector(UISelectors.deleteMeal).addEventListener('click', itemDelete);

        // Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Clear Button
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
    }

    const itemAddSubmit = function(e) {
        // Grab form values from UICtrl
        const input = UICtrl.getItemInput();

        // Validation
        if((input.name !== '' && input.calories !== '')) {
            // Add the item via ItemCtrl
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Update UI
            UICtrl.addListItem(newItem);
            
            // Get Totale Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Update Total Calories
            UICtrl.showTotalCalories(totalCalories);

            // Update LocalStorage
            StorageCtrl.storeItem(newItem);

            // Clear the inputs
            UICtrl.clearInputs();
        }
        e.preventDefault();
    }

    const itemEdit = function(e) {

        if(e.target.classList.contains('edit-item')) {
            // update the current item for editing
            const li = e.target.parentElement.id;
            const listID = parseInt(li.split('-')[1]);
            
            const itemToEdit = ItemCtrl.getItemById(listID);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.editItemInForm();
        }

        e.preventDefault();
    }

    const itemUpdate = function(e) {
        // Get form inputs
        const input = UICtrl.getItemInput();

        // update item
        const update = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(update);

        StorageCtrl.updateStorageItem(update);

        UICtrl.clearEditState();

        // Update Total Calories
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

        e.preventDefault();
    }

    const itemDelete = function(e) {
        // Get the current item
        const current = ItemCtrl.getCurrentItem();

        // Delete from DS
        ItemCtrl.deleteItem(current.id);

        // Delete from UI
        UICtrl.removeListItem(current.id);

        // Delete from LS
        StorageCtrl.deleteStorageItem(current.id);

        UICtrl.clearEditState();

        // Update Total Calories
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());        

        e.preventDefault();
    }

    const clearAllItems = function(e) {
        // Delete all items from ItemCtrl.data
        ItemCtrl.clearData();

        // Remove items from the UI
        UICtrl.removeAllItems();

        // Remove items from LS
        StorageCtrl.clearStorageItems();

        // Update Total Calories
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories()); 

        e.preventDefault();
    }
    
    // Public API
    return {
        init: function() {
            console.log('Initializing App...');

            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            UICtrl.populateItemList(items);

            // Get Totale Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Update Total Calories
            UICtrl.showTotalCalories(totalCalories);

            // Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();