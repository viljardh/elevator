

class ElevatorSimulator {
    constructor() {
        this.building = new Building();
        this.building.initializeBuilding();
        this.building.initializeControls();
        this.floors = this.building.floors;
        this.elevator = this.building.getElevator();
        this.elevator.updateElevatorPosition();
        this.updateDisplay();
        this.globalPeopleIdCounter = 0;
    }

    addPerson(fromFloor, toFloor) {
        
        if (fromFloor === toFloor) {
            alert("From and To floors cannot be the same!");
            return;
        }

        // Make new person
        const person = new Person(this.globalPeopleIdCounter, fromFloor, toFloor);
        this.globalPeopleIdCounter ++;
        
        // Add to floor using building's findFloor method
        let floor = this.building.findFloor(fromFloor)
        console.log(floor)
        floor.addPerson(person)

        // Add to elevator queue
        this.elevator.queuePerson(person);

        // Gotta fix this, want to render from floor, not elevator
        this.renderPeople();
        this.updateDisplay();

        // Automatically call elevator to pick up the person
        this.callElevator(fromFloor);
    }

    updateDisplay() {
        document.getElementById('currentFloor').textContent = this.elevator.currentFloor;
        document.getElementById('elevatorStatus').textContent = this.elevator.isMoving ? 'Moving' : 'Idle';
        document.getElementById('elevatorCapacity').textContent = `${this.elevator.elevatorPeople.length}/${this.maxCapacity}`;
        document.getElementById('floorQueue').textContent = 
            this.elevator.floorQueue.size > 0 ? Array.from(this.elevator.floorQueue).sort((a,b) => a-b).join(', ') : 'Empty';
        document.getElementById('totalPeople').textContent = this.building.totalPeopleWaiting();

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
        console.log('Clearing all people - before:', this.elevator.peopleQueue.length, this.elevator.elevatorPeople.length);
        this.elevator.clearAllPeople();
        console.log('Clearing all people - after:', this.elevator.peopleQueue.length, this.elevator.elevatorPeople.length);
        this.renderPeople();
        this.updateDisplay();
    }

    async moveToFloor(targetFloor) {
        if (this.elevator.currentFloor === targetFloor) return;

        this.elevator.isMoving = true;
        this.elevator.elevator.classList.add('moving');
        this.updateButtonStates();
        this.updateDisplay();

        const travelTime = Math.abs(targetFloor - this.elevator.currentFloor) * 500;
        
        this.elevator.currentFloor = targetFloor;
        this.elevator.updateElevatorPosition();

        await new Promise(resolve => setTimeout(resolve, travelTime));

        this.elevator.isMoving = false;
        this.elevator.elevator.classList.remove('moving');
        this.updateButtonStates();
        this.updateDisplay();
    }

    async handlePeopleAtFloor(floor) {  
        // People getting off - remove them completely from the simulation
        const peopleGettingOff = this.elevator.elevatorPeople.filter(p => p.destinationFloor === floor);
        this.elevator.elevatorPeople = this.elevator.elevatorPeople.filter(p => p.destinationFloor !== floor);
        console.log(`People getting off: ${peopleGettingOff.length}`);
        
        // People getting on - move them from waiting to elevator
        const availableCapacity = this.elevator.maxCapacity - this.elevator.elevatorPeople.length;
        let peopleBoarded = 0;

        // Get the floor object to remove people from
        const floorObj = this.building.findFloor(floor);

        // Filter people who are waiting at this floor and can board
        const originalPeopleCount = this.elevator.peopleQueue.length;
        this.elevator.peopleQueue = this.elevator.peopleQueue.filter(person => {
            if (person.currentFloor === floor && 
                !person.inElevator && 
                peopleBoarded < availableCapacity) {
                
                console.log(`Person boarding: from floor ${person.currentFloor} to floor ${person.destinationFloor}`);
                // Move person to elevator
                person.enterElevator();
                this.elevator.elevatorPeople.push(person);
                this.elevator.floorQueue.add(person.destinationFloor);
                peopleBoarded++;
                
                // Remove person from floor waiting list
                if (floorObj) {
                    floorObj.removePerson(person);
                }
                
                // Remove from waiting people array
                return false;
            }
            return true;
        });
        
        console.log(`Filtered people array: ${originalPeopleCount} -> ${this.elevator.peopleQueue.length} (removed ${originalPeopleCount - this.elevator.peopleQueue.length})`);

        console.log(`After: people waiting: ${this.elevator.peopleQueue.length}, people in elevator: ${this.elevator.elevatorPeople.length}`);
        console.log(`People boarded: ${peopleBoarded}`);

        // Door animation
        if (peopleGettingOff.length > 0 || peopleBoarded > 0) {
            this.elevator.elevator.querySelector('div').textContent = '🔓';
            
            // Immediately call render to update display while doors are open
            if (typeof window.renderPeopleCallback === 'function') {
                console.log('Calling renderPeopleCallback during door opening');
                window.renderPeopleCallback();
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.elevator.elevator.querySelector('div').textContent = '🚪';
        }

        this.updateDisplay();
        // Call external renderPeople function if it exists
        if (typeof window.renderPeopleCallback === 'function') {
            console.log('Calling renderPeopleCallback after handling floor');
            window.renderPeopleCallback();
        } else {
            console.log('renderPeopleCallback not found');
        }
    }

    updateButtonStates() {
        const buttons = document.querySelectorAll('.floor-button');
        buttons.forEach((button, index) => {
            const floor = 10 - index;
            button.disabled = this.elevator.isMoving;
            
            if (floor === this.elevator.currentFloor && !this.elevator.isMoving) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    callElevator(targetFloor) {
        this.elevator.floorQueue.add(targetFloor);
        this.updateDisplay();
        
        if (!this.elevator.isMoving) {
            this.processQueue();
        }
    }

    async processQueue() {
        while (this.elevator.floorQueue.size > 0 || this.elevator.elevatorPeople.length > 0) {
            let nextFloor = this.elevator.findNextFloor();
            if (nextFloor !== null) {
                this.elevator.floorQueue.delete(nextFloor);
                await this.moveToFloor(nextFloor);
                await this.handlePeopleAtFloor(nextFloor);
            } else {
                break;
            }
        }
    }

    // Not looking forward to this
    renderPeople() {
        console.log('=== RENDER PEOPLE START ===');
        console.log('Rendering people - people array length:', this.elevator.peopleQueue.length, 'elevator people length:', this.elevator.elevatorPeople.length);
        
        // Log details about people
        console.log('People waiting on floors:');
        this.elevator.peopleQueue.forEach((person, i) => {
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
        this.elevator.peopleQueue.forEach(person => {
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
    elevator.queuePerson(new Person(fromFloor, toFloor));
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