class myClass {
    constructor(nameClass, numberOfStudents, notAvailableNumbers = []) {
        this.nameClass = nameClass;
        this.numberOfStudents = numberOfStudents;
        this.notAvailableNumbers = notAvailableNumbers;
    }
}

let classes = [];
let elementCounter = 0;
let currentClassPos = 0;
let deleteFlag = false;
// localStorage.clear();

// read form localstorage
const saved = localStorage.getItem('classes');
if (saved) {
    parsed = JSON.parse(saved);
    classes = parsed.map(
        (c) => new myClass(c.nameClass, c.numberOfStudents, c.notAvailableNumbers)
    );
}

// elementCounter = localStorage.getItem('elementCounter');
// if (!elementCounter) {
//     elementCounter = '0';
// }

const page = document.body.dataset.page;

// -------------  ADDCLASS FILE -----------------
if (page === 'addClass') {
    // DOM REFERENCES
    const btnAdd = document.querySelector('.apply');
    const nameClassInput = document.querySelector('.field input');
    const numberOfStudentsInput = document.querySelector('.field-inline input');

    // LOGIC / HANDLERS

    // handle edit class
    const params = new URLSearchParams(window.location.search);
    console.log(params);

    if (params.size != 0) {
        currentClassPos = params.get('currPos');
        nameClassInput.value = classes[currentClassPos].nameClass;
        numberOfStudentsInput.value = classes[currentClassPos].numberOfStudents;
        btnAdd.textContent = 'Edytuj';
    }

    btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        if (params.size != 0) {
            classes[currentClassPos].nameClass = nameClassInput.value;
            classes[currentClassPos].numberOfStudents = numberOfStudentsInput.value;
        } else {
            const class1 = new myClass(nameClassInput.value, numberOfStudentsInput.value);
            console.log(class1);

            classes.push(class1);
        }

        // write to localstorage
        localStorage.setItem('classes', JSON.stringify(classes));
        // localStorage.setItem('elementCounter', elementCounter);

        window.location.href = 'index.html';
    });
}

// -------------  INDEX FILE  ---------------------
if (page === 'main') {
    // DOM REFERENCES
    const div = document.querySelector('.content');
    const list = document.createElement('ul');
    list.classList.add('list-view');

    div.appendChild(list);

    // LOGIC / HANDLERS

    classes.forEach((c) => {
        const li = document.createElement('li');
        const btnClass = document.createElement('button');
        btnClass.textContent = c.nameClass;
        li.appendChild(btnClass);
        list.appendChild(li);

        btnClass.addEventListener('click', (e) => {
            e.preventDefault();
            if (deleteFlag) {
                // delete class   ---------  HERE  ----------
                const lis = list.querySelectorAll('li');
                const li = [...lis].filter((val) => val.textContent === c.nameClass);
                list.removeChild(li[0]);

                classes.splice(classes.indexOf(c), 1);
                localStorage.setItem('classes', JSON.stringify(classes));
            } else {
                // save current class pos
                currentClassPos = classes.indexOf(c);

                localStorage.setItem('currentClassPos', currentClassPos);

                window.location.href = 'classView.html';
            }
        });
    });

    const delBtn = document.querySelector('.delete');
    delBtn.addEventListener('click', () => {
        deleteFlag = !deleteFlag;
        const imgDelete = document.querySelector('.delete img');
        if (deleteFlag) {
            imgDelete.setAttribute('src', 'minus-red.png');
        } else {
            imgDelete.setAttribute('src', 'minus.png');
        }
    });
}

// -------------  CLASS VIEW FILE  -----------------
if (page === 'classView') {
    // read form localStorage
    currentClassPos = localStorage.getItem('currentClassPos');
    const saved = localStorage.getItem('classes');
    if (saved) {
        parsed = JSON.parse(saved);
        classes = parsed.map(
            (c) => new myClass(c.nameClass, c.numberOfStudents, c.notAvailableNumbers)
        );
    }

    document.querySelector('.class-name').textContent = classes[currentClassPos].nameClass;

    const grid = document.getElementById('grid');

    let allNumbers = [];

    // create grid
    for (let i = 1; i <= classes[currentClassPos].numberOfStudents; i++) {
        const square = document.createElement('div');
        square.textContent = i;
        square.classList.add('square');
        grid.appendChild(square);
        allNumbers.push(i);

        // add active class to square with notAvailableNumbers
        for (val of classes[currentClassPos].notAvailableNumbers) {
            if (i === val) {
                square.classList.toggle('active');
            }
        }

        // handle square click
        square.addEventListener('click', () => {
            square.classList.toggle('active');
            let numTab = classes[currentClassPos].notAvailableNumbers;
            if (!numTab.includes(i)) {
                numTab.push(i);
            } else if (numTab.includes(i)) {
                numTab.splice(numTab.indexOf(i), 1);
            }
            classes[currentClassPos].notAvailableNumbers = numTab;
        });
    }

    // handle back button
    const backBtn = document.querySelector('.back');
    backBtn.addEventListener('click', () => {
        localStorage.setItem('classes', JSON.stringify(classes));
    });

    const drawBtn = document.querySelector('.drawButton');
    drawBtn.addEventListener('click', () => {
        const availableNumbers = allNumbers.filter((val) => {
            return !classes[currentClassPos].notAvailableNumbers.includes(val);
        });
        index = Math.floor(Math.random() * availableNumbers.length);
        const drawNumber = availableNumbers[index];
        document.querySelector('.drawNumber').textContent = drawNumber;
    });

    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', () => {
        classes[currentClassPos].notAvailableNumbers.length = 0;

        const allActiveSquare = document.querySelectorAll('.active');
        for (sq of allActiveSquare) {
            sq.classList.remove('active');
        }
    });

    const editBtn = document.querySelector('.edit');
    editBtn.addEventListener(
        'click',
        () => (window.location.href = `addClass.html?currPos=${currentClassPos}`)
    );
}
