const resourceList = document.getElementById("resourceList");
const toggleEditModeButton = document.getElementById("toggleEditMode");
const addOptions = document.getElementById("addOptions");
const addList = document.getElementById("addList");
let isEditMode = false;

// Use the current page URL as a unique key for storing data
const pageId = window.location.pathname;

// Load saved data for the page if it exists
function loadData() {
    const savedData = localStorage.getItem(pageId);
    if (savedData) {
        resourceList.innerHTML = savedData;
    }
    reattachDeleteButtons();
}

function saveData() {
    localStorage.setItem(pageId, resourceList.innerHTML);
}

// Update visibility of the delete button and other elements based on edit mode
function updateEditMode() {
    toggleEditModeButton.textContent = isEditMode ? "Exit Edit Mode" : "Enter Edit Mode";
    addOptions.style.display = isEditMode ? "block" : "none";

    resourceList.querySelectorAll("ul").forEach(list => {
        list.contentEditable = isEditMode;

        list.querySelectorAll(".edit-fields").forEach(inputFields => {
            inputFields.style.display = isEditMode ? "inline-block" : "none";
        });

        list.querySelectorAll("li").forEach(item => {
            item.classList.toggle("editable", isEditMode);
        });

        list.querySelectorAll(".delete-button").forEach(button => {
            button.style.display = isEditMode ? "inline-block" : "none";
        });

        list.querySelectorAll(".link").forEach(link => {
            link.style.display = isEditMode ? "none" : "inline";
        });

        // Show/hide the add link button based on edit mode
        list.querySelectorAll(".add-link-button").forEach(button => {
            button.style.display = isEditMode ? "inline-block" : "none";
        });
    });
}

toggleEditModeButton.addEventListener("click", () => {
    isEditMode = !isEditMode;
    updateEditMode();
    saveData(); 
});

addList.addEventListener("click", () => {
    const list = document.createElement("ul");
    list.style.listStyleType = "disc";

    // Create the heading with a delete button
    const headingContainer = document.createElement("div");
    headingContainer.style.display = "flex";
    headingContainer.style.alignItems = "center";
    headingContainer.style.justifyContent = "space-between"; 
    const heading = document.createElement("span"); 
    heading.textContent = "List Heading";
    heading.style.fontWeight = "bold";
    headingContainer.appendChild(heading);

    // Create the delete button with an icon
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>`; // X icon
    deleteButton.style.display = isEditMode ? "inline-block" : "none"; 
    deleteButton.addEventListener("click", () => {
        list.remove(); 
        saveData(); 
    });
    headingContainer.appendChild(deleteButton);

    // Add the heading container to the list
    list.appendChild(headingContainer);

    // Create the add link button and place it below the last item
    const addLinkButton = document.createElement("button");
    addLinkButton.classList.add("add-link-button");
    addLinkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
    addLinkButton.style.display = isEditMode ? "inline-block" : "none"; 
    
    addLinkButton.addEventListener("click", () => {
        const listItem = document.createElement("li");
        listItem.classList.add("editable");
        listItem.style.marginLeft = "20px";

        // Create the link name and URL input fields (empty by default)
        const linkNameInput = document.createElement("input");
        linkNameInput.type = "text";
        linkNameInput.placeholder = "Name";
        linkNameInput.className = "link-name-field edit-fields"; 
        linkNameInput.style.display = isEditMode ? "inline-block" : "none";

        const linkUrlInput = document.createElement("input");
        linkUrlInput.type = "text";
        linkUrlInput.placeholder = "URL";
        linkUrlInput.className = "link-url-field edit-fields";
        linkUrlInput.style.display = isEditMode ? "inline-block" : "none";

        // Create the actual <a> tag
        const link = document.createElement("a");
        link.href = ""; 
        link.target = "_blank"; 
        link.textContent = "Example Link"; 
        link.classList.add("link"); 
        link.style.display = isEditMode ? "none" : "inline";

        linkNameInput.addEventListener("input", () => {
            link.textContent = linkNameInput.value.trim() || "Example Link"; 
            saveData(); 
        });

        linkUrlInput.addEventListener("input", () => {
            let userInputUrl = linkUrlInput.value.trim();
            if (userInputUrl && !userInputUrl.startsWith('http://') && !userInputUrl.startsWith('https://')) {
                userInputUrl = 'https://' + userInputUrl; 
            }
            link.href = userInputUrl; 
            saveData(); 
        });

        listItem.appendChild(link);
        listItem.appendChild(linkNameInput);
        listItem.appendChild(linkUrlInput);

        list.appendChild(listItem);
        saveData();
    });

    // Append the "add link" button to the list, after all list items
    list.appendChild(addLinkButton);

    resourceList.appendChild(list);
    saveData();
    updateEditMode();
});

// Reattach delete button functionality after page reload
function reattachDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const list = this.closest('ul');
            if (list) {
                list.remove();
                saveData();
            }
        });
    });
}

// Initialize the page
window.addEventListener("load", loadData);
window.addEventListener("beforeunload", saveData);
