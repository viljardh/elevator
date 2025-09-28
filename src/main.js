

class ElevatorSimulator {
    constructor() {
        this.personIdCounter = 0;
        this.currentFloor = 1;
        this.isMoving = false;
        this.queue = new Set();
        this.people = [];
        this.elevatorPeople = [];
        this.maxCapacity = 8;
        this.elevator = null;
        
        this.initializeBuilding();
        this.initializeControls();
        this.updateElevatorPosition();
        this.updateDisplay();
    }

    initializeBuilding() {
        const building = document.querySelector('.building');
        building.innerHTML = '';

        // Create floors (10 to 1 from top to bottom)
        for (let floor = 10; floor >= 1; floor--) {
            const floorDiv = document.createElement('div');
            floorDiv.className = 'floor';
            floorDiv.dataset.floor = floor;
            floorDiv.innerHTML = `
                <span class="floor-number">${floor}</span>
                <div class="people-waiting" data-floor="${floor}"></div>
            `;
            building.appendChild(floorDiv);
        }

        // Create elevator
        const elevator = document.createElement('div');
        elevator.className = 'elevator';
        elevator.id = 'elevator';
        elevator.innerHTML = `
            <div style="font-size: 10px;">🚪</div>
            <div class="elevator-people" id="elevatorPeople"></div>
        `;
        building.appendChild(elevator);
        this.elevator = elevator;
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
            button.onclick = () => this.callElevator(floor);
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

        const person = new Person(personIdCounter, fromFloor, toFloor);
        personIdCounter++;
        this.people.push(person);
        this.renderPeople();
        this.updateDisplay();

        // Automatically call elevator to pick up the person
        this.callElevator(fromFloor);
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
        console.log('Clearing all people - before:', this.people.length, this.elevatorPeople.length);
        this.people = [];
        this.elevatorPeople = [];
        this.queue.clear();
        console.log('Clearing all people - after:', this.people.length, this.elevatorPeople.length);
        this.renderPeople();
        this.updateDisplay();
    }

    renderPeople() {
        console.log('Rendering people - people array length:', this.people.length, 'elevator people length:', this.elevatorPeople.length);
        
        // Clear all people displays
        const peopleWaitingDivs = document.querySelectorAll('.people-waiting');
        console.log('Found people-waiting divs:', peopleWaitingDivs.length);
        peopleWaitingDivs.forEach(div => {
            div.innerHTML = '';
        });

        // Render people waiting on floors
        this.people.forEach(person => {
            if (!person.inElevator) {
                const floorDiv = document.querySelector(`[data-floor="${person.currentFloor}"]`);
                if (floorDiv) {
                    const personDiv = document.createElement('div');
                    personDiv.className = `person ${person.direction === 'up' ? 'person-up' : 'person-down'}`;
                    personDiv.textContent = person.destinationFloor;
                    personDiv.innerHTML += `<div class="person-tooltip">Going to Floor ${person.destinationFloor}</div>`;
                    floorDiv.appendChild(personDiv);
                }
            }
        });

        // Render people in elevator
        const elevatorPeopleDiv = document.getElementById('elevatorPeople');
        console.log('Elevator people div found:', !!elevatorPeopleDiv);
        if (elevatorPeopleDiv) {
            elevatorPeopleDiv.innerHTML = '';
            this.elevatorPeople.forEach(person => {
                const personDiv = document.createElement('div');
                personDiv.className = 'elevator-person';
                personDiv.textContent = person.destinationFloor;
                personDiv.title = `Going to Floor ${person.destinationFloor}`;
                elevatorPeopleDiv.appendChild(personDiv);
            });
        }
    }

    callElevator(targetFloor) {
        this.queue.add(targetFloor);
        this.updateDisplay();
        
        if (!this.isMoving) {
            this.processQueue();
        }
    }

    async processQueue() {
        while (this.queue.size > 0 || this.elevatorPeople.length > 0) {
            let nextFloor = this.findNextFloor();
            if (nextFloor !== null) {
                this.queue.delete(nextFloor);
                await this.moveToFloor(nextFloor);
                await this.handlePeopleAtFloor(nextFloor);
            } else {
                break;
            }
        }
    }

    findNextFloor() {
        // Check if anyone in elevator needs to get off
        for (let person of this.elevatorPeople) {
            if (person.destinationFloor !== this.currentFloor) {
                return person.destinationFloor;
            }
        }

        // Find closest floor in queue
        if (this.queue.size === 0) return null;
        
        let closest = null;
        let minDistance = Infinity;
        
        for (let floor of this.queue) {
            let distance = Math.abs(floor - this.currentFloor);
            if (distance < minDistance) {
                minDistance = distance;
                closest = floor;
            }
        }
        
        return closest;
    }

    async moveToFloor(targetFloor) {
        if (this.currentFloor === targetFloor) return;

        this.isMoving = true;
        this.elevator.classList.add('moving');
        this.updateButtonStates();
        this.updateDisplay();

        const travelTime = Math.abs(targetFloor - this.currentFloor) * 500;
        
        this.currentFloor = targetFloor;
        this.updateElevatorPosition();

        await new Promise(resolve => setTimeout(resolve, travelTime));

        this.isMoving = false;
        this.elevator.classList.remove('moving');
        this.updateButtonStates();
        this.updateDisplay();
    }

    async handlePeopleAtFloor(floor) {
        // People getting off
        const peopleGettingOff = this.elevatorPeople.filter(p => p.destinationFloor === floor);
        this.elevatorPeople = this.elevatorPeople.filter(p => p.destinationFloor !== floor);
        
        // Remove people who reached their destination
        peopleGettingOff.forEach(person => {
            const index = this.people.findIndex(p => p.id === person.id);
            if (index > -1) {
                this.people.splice(index, 1);
            }
        });

        // People getting on
        const peopleWaiting = this.people.filter(p => 
            p.currentFloor === floor && 
            !p.inElevator &&
            this.elevatorPeople.length < this.maxCapacity
        );

        for (let person of peopleWaiting) {
            if (this.elevatorPeople.length < this.maxCapacity) {
                person.inElevator = true;
                this.elevatorPeople.push(person);
                // Add destination to queue
                this.queue.add(person.destinationFloor);
            }
        }

        // Door animation
        if (peopleGettingOff.length > 0 || peopleWaiting.length > 0) {
            this.elevator.querySelector('div').textContent = '🔓';
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.elevator.querySelector('div').textContent = '🚪';
        }

        this.renderPeople();
        this.updateDisplay();
    }

    updateElevatorPosition() {
        const bottomPosition = (this.currentFloor - 1) * 60 + 5;
        this.elevator.style.bottom = bottomPosition + 'px';
    }

    updateDisplay() {
        document.getElementById('currentFloor').textContent = this.currentFloor;
        document.getElementById('elevatorStatus').textContent = this.isMoving ? 'Moving' : 'Idle';
        document.getElementById('elevatorCapacity').textContent = `${this.elevatorPeople.length}/${this.maxCapacity}`;
        document.getElementById('totalPeople').textContent = this.people.length;
        document.getElementById('floorQueue').textContent = 
            this.queue.size > 0 ? Array.from(this.queue).sort((a,b) => a-b).join(', ') : 'Empty';
    }

    updateButtonStates() {
        const buttons = document.querySelectorAll('.floor-button');
        buttons.forEach((button, index) => {
            const floor = 10 - index;
            button.disabled = this.isMoving;
            
            if (floor === this.currentFloor && !this.isMoving) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
}

// Initialize the elevator simulator
const elevator = new ElevatorSimulator();

// Global functions
function callElevator(floor) {
    elevator.callElevator(floor);
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
        elevator.callElevator(floor);
    } else if (e.key === '0') {
        elevator.callElevator(10);
    } else if (e.key === 'r') {
        elevator.addRandomPerson();
    }
});

// Auto-add some people on start
setTimeout(() => {
    elevator.addRandomPerson();
    elevator.addRandomPerson();
}, 1000);