let selectedCells = [];
let attempts = 0;

function generateGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.pos = i.toString();
        grid.appendChild(cell);
    }
}

document.getElementById("introButton").addEventListener("click", function() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("startButton").click();
});

document.getElementById("startButton").addEventListener("click", function() {
    generateGrid();
    selectedCells = [];
    selectedCells.push(...getRandomStart(3, 7, selectedCells, Math.random() < 0.5));
    selectedCells.push(...getRandomStart(3, 7, selectedCells, Math.random() < 0.5));
    selectedCells.push(...getRandomStart(4, 6, selectedCells, Math.random() < 0.5));
    selectedCells.push(...getRandomStart(4, 6, selectedCells, Math.random() < 0.5));
    selectedCells.push(...getRandomStart(5, 5, selectedCells, Math.random() < 0.5));
    
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.remove("selected");
        cell.innerText = "";
    });
    document.getElementById("grid").hidden = false;
    document.getElementById("result").innerText = "";
    attempts = 0;
    updateBackgroundImage();
});

function getRandomStart(length, limit, existingCells, isVertical = false) {
    let newCells;
    let hasOverlap;
    do {
        const startRow = isVertical ? Math.floor(Math.random() * (10 - length + 1)) : Math.floor(Math.random() * 10);
        const startCol = isVertical ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * (limit - length + 1));
        const startIndex = startRow * 10 + startCol;
        newCells = [];
        for (let i = 0; i < length; i++) {
            newCells.push(isVertical ? startIndex + i * 10 : startIndex + i);
        }
        hasOverlap = newCells.some(cell => existingCells.includes(cell));
    } while (hasOverlap);
    return newCells;
}

document.getElementById("grid").addEventListener("click", function(e) {
    if (e.target.classList.contains("cell")) {
        const pos = parseInt(e.target.dataset.pos);
        if (selectedCells.includes(pos)) {
            e.target.innerText = "〇";
            const shipCells = selectedCells.filter(index => document.querySelector(`.cell[data-pos="${index}"]`).innerText === "〇");
            if (shipCells.length === selectedCells.length) {
                document.getElementById("result").innerText = `よし、${attempts}発で敵軍艦を全て沈めたぞ！`;
                document.getElementById("result").style.color = "red";
                document.getElementById("result").style.fontWeight = "bold";
            } else {
                document.getElementById("result").innerText = "よくやった！まだ近くにいるはずだ！";
                document.getElementById("result").style.color = "red";
                document.getElementById("result").style.fontWeight = "normal";
            }
        } else {
            e.target.innerText = "×";
            document.getElementById("result").innerText = "そこにはいないようだ、、";
            document.getElementById("result").style.color = "blue";
            document.getElementById("result").style.fontWeight = "normal";
        }
        e.target.classList.add("selected");
        attempts++;
        updateBackgroundImage();
    }
});

function updateBackgroundImage() {
    const imageNumber = Math.floor(attempts / 10) + 1;
    const imagePath = `url('img/hit${imageNumber}.webp')`; // バッククォートを使う
    document.documentElement.style.setProperty('--background-image', imagePath);
}
