const resourceList = document.getElementById("resourceList");
const toggleEditModeButton = document.getElementById("toggleEditMode");
const addOptions = document.getElementById("addOptions");
const addList = document.getElementById("addList");
let isEditMode = false;


toggleEditModeButton.addEventListener("click", () => {
    isEditMode = !isEditMode;
    toggleEditModeButton.textContent = isEditMode ? "Exit Edit Mode" : "Enter Edit Mode";
    addOptions.style.display = isEditMode ? "block" : "none";
    
});

addList.addEventListener("click", () => {
    alert("Code this yourself make it work")
});
