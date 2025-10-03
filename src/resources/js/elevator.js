class Elevator {
    constructor(maxCapacity = 8) {
        this.currentFloor = 1;
        this.isMoving = false;
        this.floorQueue = new Set();
        this.peopleQueue = [];
        this.elevatorPeople = [];
        this.maxCapacity = maxCapacity;
        this.elevator = null;
        this.direction = null;

        this.initializeElevator();
    }

    initializeElevator() {
        const building = document.querySelector('.building');
        if (!building) {
            console.error('Building element not found');
            return;
        }

        // Create elevator element
        const elevator = document.createElement('div');
        elevator.className = 'elevator';
        elevator.id = 'elevator';
        elevator.innerHTML = `
            <div style="font-size: 10px;">🚪</div>
            <div class="elevator-people" id="elevatorPeople"></div>
        `;
        building.appendChild(elevator);
        this.elevator = elevator;
        console.log('Elevator created and added to building');
    }

    updateElevatorPosition() {
        if (!this.elevator) {
            console.error('Elevator element not found for positioning');
            return;
        }
        const bottomPosition = (this.currentFloor - 1) * 60 + 5;
        this.elevator.style.bottom = bottomPosition + 'px';
        console.log(`Elevator positioned at floor ${this.currentFloor}, bottom: ${bottomPosition}px`);
    }


    findNextFloor() {
        // Check if anyone in elevator needs to get off
        for (let person of this.elevatorPeople) {
            if (person.destinationFloor !== this.currentFloor) {
                return person.destinationFloor;
            }
        }

        // Find closest floor in queue
        if (this.floorQueue.size === 0) return null;
        
        let closest = null;
        let minDistance = Infinity;
        
        for (let floor of this.floorQueue) {
            let distance = Math.abs(floor - this.currentFloor);
            if (distance < minDistance) {
                minDistance = distance;
                closest = floor;
            }
        }
        
        return closest;
    }


    async handlePeopleAtFloor(floor) {
        console.log(`Handling people at floor ${floor}`);
        console.log(`Before: people waiting: ${this.peopleQueue.length}, people in elevator: ${this.elevatorPeople.length}`);
        
        // People getting off - remove them completely from the simulation
        const peopleGettingOff = this.elevatorPeople.filter(p => p.destinationFloor === floor);
        this.elevatorPeople = this.elevatorPeople.filter(p => p.destinationFloor !== floor);
        console.log(`People getting off: ${peopleGettingOff.length}`);
        
        // People getting on - move them from waiting to elevator
        const availableCapacity = this.maxCapacity - this.elevatorPeople.length;
        let peopleBoarded = 0;

        // Filter people who are waiting at this floor and can board
        const originalPeopleCount = this.peopleQueue.length;
        this.peopleQueue = this.peopleQueue.filter(person => {
            if (person.currentFloor === floor && 
                !person.inElevator && 
                peopleBoarded < availableCapacity) {
                
                console.log(`Person boarding: from floor ${person.currentFloor} to floor ${person.destinationFloor}`);
                // Move person to elevator
                person.enterElevator();
                this.elevatorPeople.push(person);
                this.floorQueue.add(person.destinationFloor);
                peopleBoarded++;
                
                // Remove from waiting people array
                return false;
            }
            return true;
        });
        
        console.log(`Filtered people array: ${originalPeopleCount} -> ${this.peopleQueue.length} (removed ${originalPeopleCount - this.peopleQueue.length})`);

        console.log(`After: people waiting: ${this.peopleQueue.length}, people in elevator: ${this.elevatorPeople.length}`);
        console.log(`People boarded: ${peopleBoarded}`);

        // Door animation
        if (peopleGettingOff.length > 0 || peopleBoarded > 0) {
            this.elevator.querySelector('div').textContent = '🔓';
            
            // Immediately call render to update display while doors are open
            if (typeof window.renderPeopleCallback === 'function') {
                console.log('Calling renderPeopleCallback during door opening');
                window.renderPeopleCallback();
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.elevator.querySelector('div').textContent = '🚪';
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
            button.disabled = this.isMoving;
            
            if (floor === this.currentFloor && !this.isMoving) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    queuePerson(person) {
        this.peopleQueue.push(person);
    }

    clearAllPeople() {
        this.peopleQueue = [];
        this.elevatorPeople = [];
        this.floorQueue.clear();
    }
}