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
    reattachAddLinkButton();
}

function saveData() {
    localStorage.setItem(pageId, resourceList.innerHTML);
}

// Update visibility of the delete button and other elements based on edit mode
function updateEditMode() {
    toggleEditModeButton.textContent = isEditMode ? "Exit Edit Mode" : "Enter Edit Mode";
    addOptions.style.display = isEditMode ? "block" : "none";

    resourceList.querySelectorAll("ul").forEach(list => {
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

        list.querySelectorAll(".add-link-button").forEach(button => {
            button.style.display = isEditMode ? "inline-block" : "none";
        });     

        list.querySelectorAll(".paste-button").forEach(button => {
            button.style.display = isEditMode ? "inline-block" : "none";
        });  
    });

    // Loop through all lists to update contentEditable for headings
    resourceList.querySelectorAll("ul").forEach(list => {
        const headingContainer = list.querySelector("div");
        const heading = headingContainer ? headingContainer.querySelector("span") : null;
        
        // Only set contentEditable for the first heading (or all headings if needed)
        if (heading) {
            heading.contentEditable = isEditMode ? "true" : "false";  // Set contentEditable properly
        }
    });

    // Ensure the links and input fields are properly populated in edit mode
    resourceList.querySelectorAll('li').forEach(listItem => {
        const linkNameInput = listItem.querySelector('.link-name-field');
        const linkUrlInput = listItem.querySelector('.link-url-field');
        const pasteButton = listItem.querySelector('.paste-button');
        
        if (linkNameInput && linkUrlInput) {
            linkNameInput.style.display = isEditMode ? "inline-block" : "none";
            linkUrlInput.style.display = isEditMode ? "inline-block" : "none";
            pasteButton.style.display = isEditMode ? "inline-block" : "none";

            // Populate the input fields with the current link values
            const link = listItem.querySelector('.link');
            if (link) {
                linkNameInput.value = link.textContent.trim() || '';
                linkUrlInput.value = link.href || '';
            }
        }
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
    heading.contentEditable = isEditMode ? true : false;
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

        // Create the paste button with SVG inside
        const pasteBut = document.createElement("button");
        pasteBut.className = "paste-button";
        pasteBut.style.display = isEditMode ? "inline-block" : "none";
        pasteBut.title = "Paste";
        // Create the SVG icon for the button (you can customize this as needed)
        pasteBut.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M104.6 48L64 48C28.7 48 0 76.7 0 112L0 384c0 35.3 28.7 64 64 64l96 0 0-48-96 0c-8.8 0-16-7.2-16-16l0-272c0-8.8 7.2-16 16-16l16 0c0 17.7 14.3 32 32 32l72.4 0C202 108.4 227.6 96 256 96l62 0c-7.1-27.6-32.2-48-62-48l-40.6 0C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L464 243.9 464 448c0 8.8-7.2 16-16 16zM256 512l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1L256 128c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64z"/></svg>
        `;

        // Add event listener to paste the clipboard content into the URL input field
        pasteBut.addEventListener("click", async () => {
            try {
                const clipboardText = await navigator.clipboard.readText();  
                linkUrlInput.value = clipboardText; 
                const inputEvent = new Event("input");
                linkUrlInput.dispatchEvent(inputEvent);
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        });                 

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
        listItem.appendChild(pasteBut);

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

// Attach the "Add Link" button to each list that already exists when the page is loaded
function reattachAddLinkButton() {
    const addLinkButtons = document.querySelectorAll(".add-link-button");
    addLinkButtons.forEach(button => {
        button.addEventListener("click", () => {
            const list = button.closest("ul"); // Get the closest UL to the button
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

            // Create the paste button with SVG inside
            const pasteBut = document.createElement("button");
            pasteBut.className = "paste-button";
            pasteBut.style.display = isEditMode ? "inline-block" : "none";
            pasteBut.title = "Paste";
            pasteBut.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M104.6 48L64 48C28.7 48 0 76.7 0 112L0 384c0 35.3 28.7 64 64 64l96 0 0-48-96 0c-8.8 0-16-7.2-16-16l0-272c0-8.8 7.2-16 16-16l16 0c0 17.7 14.3 32 32 32l72.4 0C202 108.4 227.6 96 256 96l62 0c-7.1-27.6-32.2-48-62-48l-40.6 0C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L464 243.9 464 448c0 8.8-7.2 16-16 16zM256 512l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1L256 128c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64z"/>
                </svg>
            `;

            // Add event listener to paste the clipboard content into the URL input field
            pasteBut.addEventListener("click", async () => {
                try {
                    const clipboardText = await navigator.clipboard.readText();  
                    linkUrlInput.value = clipboardText; 
                    const inputEvent = new Event("input");
                    linkUrlInput.dispatchEvent(inputEvent);
                } catch (err) {
                    console.error('Failed to read clipboard contents: ', err);
                }
            });                 

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
            listItem.appendChild(pasteBut);

            list.appendChild(listItem);
            saveData();
        });
    });
}


// Initialize the page
window.addEventListener("load", loadData);
window.addEventListener("beforeunload", saveData);
