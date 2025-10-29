class Elevator {
    constructor(maxCapacity = 8) {
        this.currentFloor = 1;
        this.isMoving = false;
        this.floorQueue = new Set();
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

    clearAllPeople() {
        this.elevatorPeople = [];
        this.floorQueue.clear();
    }
}