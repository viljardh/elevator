

class ElevatorSimulator {
    constructor() {
        this.floors = [];
        
        this.initializeBuilding();
        this.elevator = new Elevator(); // Create elevator after building is set up
        this.initializeControls();
        this.elevator.updateElevatorPosition();
        this.elevator.updateDisplay();
        this.globalPeopleIdCounter = 0;
    }

    initializeBuilding() {
        const building = document.querySelector('.building');
        building.innerHTML = '';

        // Create floors (10 to 1 from top to bottom) using Floor class
        for (let floorNum = 10; floorNum >= 1; floorNum--) {
            const floor = new Floor(floorNum);
            const floorDiv = floor.createElement();
            building.appendChild(floorDiv);
            this.floors.push(floor);
        }
    }

    initializeControls() {
        const floorButtons = document.getElementById('floorButtons');
        const fromFloor = document.getElementById('fromFloor');
        const toFloor = document.getElementById('toFloor');

        // Create floor buttons
        for (let floor = 10; floor >= 1; floor--) {
            const button = document.createElement('button');
            button.className = 'floor-button';
            button.textContent = `Floor ${floor}`;
            button.onclick = () => this.elevator.callElevator(floor);
            if (floor === 1) button.classList.add('active');
            floorButtons.appendChild(button);
        }

        // Populate floor selectors
        for (let floor = 1; floor <= 10; floor++) {
            fromFloor.innerHTML += `<option value="${floor}">Floor ${floor}</option>`;
            toFloor.innerHTML += `<option value="${floor}">Floor ${floor}</option>`;
        }
        toFloor.selectedIndex = 1; // Default to floor 2
    }

    addPerson(fromFloor, toFloor) {
        if (fromFloor === toFloor) {
            alert("From and To floors cannot be the same!");
            return;
        }

        const person = new Person(this.globalPeopleIdCounter, fromFloor, toFloor);
        this.globalPeopleIdCounter ++;
        this.elevator.addPerson(person);
        this.renderPeople();
        this.elevator.updateDisplay();

        // Automatically call elevator to pick up the person
        this.elevator.callElevator(fromFloor);
    }

    addRandomPerson() {
        const fromFloor = Math.floor(Math.random() * 10) + 1;
        let toFloor;
        do {
            toFloor = Math.floor(Math.random() * 10) + 1;
        } while (toFloor === fromFloor);
        
        this.addPerson(fromFloor, toFloor);
    }

    addMultiplePeople() {
        for (let i = 0; i < 3; i++) {
            this.addRandomPerson();
        }
    }

    clearAllPeople() {
        console.log('Clearing all people - before:', this.elevator.people.length, this.elevator.elevatorPeople.length);
        this.elevator.clearAllPeople();
        console.log('Clearing all people - after:', this.elevator.people.length, this.elevator.elevatorPeople.length);
        this.renderPeople();
        this.elevator.updateDisplay();
    }

    renderPeople() {
        console.log('=== RENDER PEOPLE START ===');
        console.log('Rendering people - people array length:', this.elevator.people.length, 'elevator people length:', this.elevator.elevatorPeople.length);
        
        // Log details about people
        console.log('People waiting on floors:');
        this.elevator.people.forEach((person, i) => {
            console.log(`  ${i}: Floor ${person.currentFloor} -> ${person.destinationFloor}, inElevator: ${person.inElevator}`);
        });
        
        console.log('People in elevator:');
        this.elevator.elevatorPeople.forEach((person, i) => {
            console.log(`  ${i}: Floor ${person.currentFloor} -> ${person.destinationFloor}, inElevator: ${person.inElevator}`);
        });
        
        // COMPLETELY clear all people displays first - both floors and elevator
        const peopleWaitingDivs = document.querySelectorAll('.people-waiting');
        console.log('Found people-waiting divs:', peopleWaitingDivs.length);
        peopleWaitingDivs.forEach(div => {
            div.innerHTML = '';
        });

        // Clear elevator people display
        const elevatorPeopleDiv = document.getElementById('elevatorPeople');
        if (elevatorPeopleDiv) {
            elevatorPeopleDiv.innerHTML = '';
        }

        // Render ONLY people who are waiting (not in elevator) on floors
        let peopleRenderedOnFloors = 0;
        this.elevator.people.forEach(person => {
            // Only render people who are NOT in the elevator
            if (!person.inElevator) {
                const floorDiv = document.querySelector(`[data-floor="${person.currentFloor}"] .people-waiting`);
                if (floorDiv) {
                    const personDiv = document.createElement('div');
                    personDiv.className = `person ${person.direction === 'up' ? 'person-up' : 'person-down'}`;
                    personDiv.textContent = person.destinationFloor;
                    personDiv.innerHTML += `<div class="person-tooltip">Going to Floor ${person.destinationFloor}</div>`;
                    floorDiv.appendChild(personDiv);
                    peopleRenderedOnFloors++;
                }
            }
        });
        console.log(`Rendered ${peopleRenderedOnFloors} people on floors`);

        // Render people in elevator
        console.log('Elevator people div found:', !!elevatorPeopleDiv);
        if (elevatorPeopleDiv) {
            this.elevator.elevatorPeople.forEach(person => {
                const personDiv = document.createElement('div');
                personDiv.className = 'elevator-person';
                personDiv.textContent = person.destinationFloor;
                personDiv.title = `Going to Floor ${person.destinationFloor}`;
                elevatorPeopleDiv.appendChild(personDiv);
            });
            console.log(`Rendered ${this.elevator.elevatorPeople.length} people in elevator`);
        }
        console.log('=== RENDER PEOPLE END ===');
    }
}

// Initialize the elevator simulator
const elevator = new ElevatorSimulator();

// Set up render callback for the elevator
window.renderPeopleCallback = () => {
    elevator.renderPeople();
};

// Global functions
function callElevator(floor) {
    elevator.elevator.callElevator(floor);
}

function addRandomPerson() {
    elevator.addRandomPerson();
}

function addMultiplePeople() {
    elevator.addMultiplePeople();
}

function clearAllPeople() {
    elevator.clearAllPeople();
}

function addSpecificPerson() {
    const fromFloor = parseInt(document.getElementById('fromFloor').value);
    const toFloor = parseInt(document.getElementById('toFloor').value);
    elevator.addPerson(fromFloor, toFloor);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const floor = parseInt(e.key);
    if (floor >= 1 && floor <= 9) {
        elevator.elevator.callElevator(floor);
    } else if (e.key === '0') {
        elevator.elevator.callElevator(10);
    } else if (e.key === 'r') {
        elevator.addRandomPerson();
    }
});

// Auto-add some people on start
setTimeout(() => {
    elevator.addRandomPerson();
    elevator.addRandomPerson();
}, 1000);