const links = [
    { href: "./resources/IT.html", text: "IT" },
    { href: "./resources/computer-science.html", text: "Computer Science" },
    { href: "./resources/maths.html", text: "Maths" },
];

const subjectLinksDiv = document.querySelector('.subject-links');

links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    subjectLinksDiv.appendChild(a);
});
