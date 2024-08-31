const form = document.querySelector("#itemForm"); 
const itemInput = document.querySelector("#itemInput"); 
const itemList = document.querySelector(".item-list");
const feedback = document.querySelector(".feedback");
const addBtn = document.querySelector("#add-item");
const clearButton = document.querySelector("#clear-list");
const bootstrap = document.head.querySelector(
  "link[href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css']"
);
const tailwindCSS = document.head.querySelector(
  "script[src='https://cdn.tailwindcss.com']"
); 
tailwindCSS && console.log("Tailwind CSS is loaded"); 
let todoItems = [];
 const handleItem = function (itemName) {
  const items = itemList.querySelectorAll(".item");
 
  items.forEach((item) => {
   
    if (
      item.querySelector(".item-name").textContent.trim().toLowerCase() ===
      itemName.trim().toLowerCase()
    ) {
       item
        .querySelector(".complete-item")
        .addEventListener("click", function () {
          let itemText = item.querySelector(".item-name");
          let itemIndex = item.querySelector(".item-index");
          console.log(itemText);
          itemText.classList.toggle("completed");
          itemIndex.classList.toggle("completed");
          // CSS
          if (bootstrap) {
           
            itemText.classList.toggle("text-decoration-line-through");
            itemText.classList.toggle("text-secondary");
            itemIndex.classList.toggle("border-success-subtle");
            itemIndex.classList.toggle("text-secondary");
          } else if (tailwindCSS) {
            
            itemText.classList.toggle("line-through");
            itemText.classList.toggle("text-slate-400");
            itemIndex.classList.toggle("border-green-500");
            itemIndex.classList.toggle("text-slate-400");
          }
 
          if (itemText.classList.contains("completed")) {
            sendFeedback(
              `Item Completed`,
              `${bootstrap ? "success" : "green"}`
            );
          }
        });
      
      item.querySelector(".edit-item").addEventListener("click", function () {
        addBtn.innerHTML = "Edit Item";
        itemInput.value = itemName;
        itemList.removeChild(item);
 
        todoItems = todoItems.filter((item) => {
          return item !== itemName;
        });
        setLocalStorage(todoItems);
      });
      
      item.querySelector(".delete-item").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this item?")) {
          itemList.removeChild(item);
 
          todoItems = todoItems.filter(function (item) {
            return item !== itemName;
          });
          setLocalStorage(todoItems);
          sendFeedback("Item deleted", `${bootstrap ? "danger" : "red"}`);
        } else {
          return;
        }
      });
    }
  });
};
const getList = function (todoItems) {
  itemList.innerHTML = "";
 
  todoItems.forEach(function (item, index) {
    if (bootstrap) {
      itemList.insertAdjacentHTML(
        "beforeend",
        `<div class="item my-3 d-flex justify-content-between align-items-center border-bottom border-success-subtle">
          <div class="d-flex gap-1">
            <h6 class="item-index border border-success-subtle  rounded p-1">${index}</h6>
            <p class="item-name text-capitalize">${item}</p>
          </div>
          <div class="item-icons" >
            <i class="far fa-check-circle complete-item mx-2 item-icon text-success"></i>
            <i class="far fa-edit edit-item mx-2 item-icon text-secondary"></i>
            <i class="far fa-times-circle delete-item item-icon text-danger"></i>
          </div>
      </div>`
      );
    } else if (tailwindCSS) {
      itemList.insertAdjacentHTML(
        "beforeend",
        `<div class="item flex justify-between my-3 border-b border-b-green-500 pb-1">
          <div class="flex gap-1 items-center">
            <h6 class="item-index border border-green-500 rounded p-1">${index}</h6>
            <p class="item-name capitalize">${item}</p>
          </div>
            <div class="item-icons">
              <i class="far fa-check-circle cursor-pointer complete-item mx-2 item-icon text-green-500"></i>
              <i class="far fa-edit cursor-pointer edit-item mx-2 item-icon"></i>
              <i class="far fa-times-circle cursor-pointer delete-item item-icon text-red-500"></i>
            </div>
         </div>`
      );
    } else {
      itemList.insertAdjacentHTML(
        "beforeend",
        `<div class="item">
            <div class="item-info">
              <h6 class="item-index">
                ${index} 
              </h6>
              <p class="item-name">
                ${item}
              </p>
            </div>
            <div class="item-icons">
              <i class="far fa-check-circle complete-item"></i>
              <i class="far fa-edit edit-item"></i>
              <i class="far fa-times-circle delete-item"></i>
            </div>
          </div>`
      );
    }
    handleItem(item);
  });
};
 

const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
    getList(todoItems);
  }
};
 

const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};
getLocalStorage();
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = itemInput.value;
  if (itemName.length === 0) {
    sendFeedback("Please Enter Valid Value", `${bootstrap ? "danger" : "red"}`);
  } else {
    addBtn.innerHTML = "Add Item";
    todoItems.push(itemName);
    setLocalStorage(todoItems);
    getList(todoItems);
    sendFeedback(
      "Item added to the list",
      `${bootstrap ? "success" : "green"}`
    );
  }
 
  itemInput.value = "";
});
clearButton.addEventListener("click", function () {
  confirm("Are you sure you want to clear the list?")
    ? ((todoItems = []), localStorage.clear(), getList(todoItems))
    : null;
});
function sendFeedback(text, className) {
  if (bootstrap) {
    feedback.classList.add("showItem", `alert-${className}`);
    feedback.innerHTML = text;
    setTimeout(function () {
      feedback.classList.remove("showItem", `alert-${className}`);
      feedback.innerHTML = "Write value for item";
    }, 3000);
  } else if (tailwindCSS) {
    feedback.classList.add(
      "border",
      `bg-${className}-100`,
      `text-${className}-700`
    );
    feedback.innerHTML = text;
    setTimeout(function () {
      feedback.classList.remove(
        "border",
        `bg-${className}-100`,
        `text-${className}-700`
      );
      feedback.innerHTML = "Write value for item";
    }, 3000);
  } else {
    feedback.classList.add(`${className}`);
    feedback.innerHTML = text;
    setTimeout(function () {
      feedback.classList.remove(`${className}`);
      feedback.innerHTML = "Write value for item";
    }, 3000);
  }
}