const fs = require('fs').promises;

let readInput = async () => {
    let res = await fs.readFile('./input10.txt');
    // let res = await fs.readFile('./testInput.txt');
    let inputs = res.toString().split('\n');
    return inputs;
}

let parseInputLine = (line) => {
    // position=< 9,  1> velocity=< 0,  2>
    let m = line.match(/position=<(?<pos>.*)> velocity=<(?<vel>.*)>/);
    let [x, y] = m.groups.pos.split(',').map(Number);
    let [dx, dy] = m.groups.vel.split(',').map(Number);
    return [x, y, dx, dy];
}

let boardDimensions = (inputs) => {
    let maxX = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let line of inputs) {
        let [x, y] = line;
        if (x > maxX) {
            maxX = x;
        }
        if (x < minX) {
            minX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (y < minY) {
            minY = y;
        }

    }
    return (maxX - minX) * (maxY - minY);
}

let printBoard = (inputs) => {
    // <y, [x] >
    let reversePoints = new Map();
    for (let line of inputs) {
        let [x, y] = line;
        reversePoints.set(y, (reversePoints.get(y) || new Set()).add(x))
    }

    let ys = [...reversePoints.keys()];
    ys.sort((a, b) => a - b);

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    for (let y of ys) {
        let xs = reversePoints.get(y);
        if (Math.min(...xs) < min) {
            min = Math.min(...xs);
        }
        if (Math.max(...xs) > max) {
            max = Math.max(...xs);
        }
    }

    for (let y of ys) {
        let row = '';
        let xs = reversePoints.get(y);
        for (let i = min; i <= max; i++) {
            if (xs.has(i)) {
                row += '#';
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
}


let main = async () => {
    let inputs = (await readInput());

    let newInputs = [];

    for (let line of inputs) {
        newInputs.push(parseInputLine(line));
    }

    let size = Number.MAX_SAFE_INTEGER;
    let newSize = size - 1;
    let i = -1;
    while (size > newSize) {
        i++;
        // printBoard(newInputs);

        inputs = newInputs;
        newInputs = [];
        size = newSize;
        for (let a of inputs) {
            let [x, y, dx, dy] = a;
            let newStar = [x + dx, y + dy, dx, dy];
            newInputs.push(newStar);
        }

        newSize = boardDimensions(newInputs);
    }
    printBoard(inputs);
    console.log(i);


}

main();