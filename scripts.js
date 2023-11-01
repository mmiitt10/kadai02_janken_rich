// 
let selectedCells = [];
// トライの数
let attempts = 0;

// grid作る
function generateGrid() {
    // gridという定数を作成し、その中にgridというIDを代入している
    const grid = document.getElementById("grid");
    // gridの中身を空っぽにしている
    grid.innerHTML = "";
    // gridを作成するにあたり、動的に作成している。gtidという定数（id）の中に、cellという定数（class）を入れ込んでいるという構造
    for (let i = 0; i < 100; i++) {
        // 10×10のセルなので、100回繰り返す必要あり
        const cell = document.createElement("div");
        // cellという箱を作成し、その中に
        cell.classList.add("cell");
        cell.dataset.pos = i.toString();
        // gridという定数の中に、cellという定数を子要素として代入している
        grid.appendChild(cell);
    }
}

// 最初の画像からゲームに遷移させる
document.getElementById("introButton").addEventListener("click", function() {
    // introというidに対して、cssの要素（style）を削除している
    document.getElementById("intro").style.display = "none";
    // startButtonをクリックしたことにして、次の画面に遷移した際にゲームを円滑に始められるようにしている
    document.getElementById("startButton").click();
});

// startButtonを押したらゲームを始める
document.getElementById("startButton").addEventListener("click", function() {
    // startButtonを押下した時に、generateGridという関数が発動してgridが作成される
    generateGrid();
    // startButtonを押下した時に、敵の戦艦の位置をランダムで決める。前回の内容が残らないように、箱の中身を空っぽにする
    selectedCells = [];

    // getRandomStart関数は、長さ、始点の限界地、重複確認、縦横の確認という変数を使用しつつ、ランダムな数値を生成している
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
});

// ランダムなセルがかぶってしまった場合、再度かぶらないようにセルを出しなおす
function getRandomStart(length, limit, existingCells, isVertical = false) {
    let newCells;
    // 新しいセルが既存のセルとかぶっているかどうかを確認
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

// gridのセルを押したときに、ランダムに設定された数字に応じて〇・×が表示される
document.getElementById("grid").addEventListener("click", function(e) {

    if (e.target.classList.contains("cell")) {
        const pos = parseInt(e.target.dataset.pos);
        if (selectedCells.includes(pos)) {
            e.target.innerText = "〇";
        } else {
            e.target.innerText = "×";
        }
        e.target.classList.add("selected");

        // Group checks
        const groupSizes = [3, 3, 4, 4, 5];
        let groupStart = 0;
        for (const size of groupSizes) {
            const group = selectedCells.slice(groupStart, groupStart + size);
            if (group.every(index => document.querySelector(`.cell[data-pos="${index}"]`).classList.contains("selected"))) {
                // No notification for sinking
            }
            groupStart += size;
        }

        // Check if all selected cells are clicked
        const allSelected = selectedCells.every(index => {
            return document.querySelector(`.cell[data-pos="${index}"]`).classList.contains("selected");
        });

        if (allSelected) {
            attempts++;
            document.getElementById("result").innerText = "ゲーム終了！ チャレンジ回数: " + attempts + "回";
        } else {
            attempts++;
        }
    }
});