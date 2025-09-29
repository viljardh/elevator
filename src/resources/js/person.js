class Person {
    constructor(id, currentFloor, destinationFloor) {
        this.id = id;
        console.log(this.id)
        this.currentFloor = currentFloor;
        this.destinationFloor = destinationFloor;
        this.direction = destinationFloor > currentFloor ? 'up' : 'down';
        this.inElevator = false;
    }

    destFloor() {
        return this.destinationFloor
    }

    id() {
        return this.id
    }

    checkIfFull(elevator) {
        for (let i = 0; i < elevator.passengers.length(); i++) {
            if (i == this.capacity - 1 ) {
                return true
            }
        }
    }

    enterElevator(elevator, floor) {
        if (!checkIfFull(elevator)) {
            this.inElevator = true 
            elevator.addPassenger(this)
        }
    }

    checkFloor(elevator) {
        return elevator.currentFloor()
    }

    leaveElevator(elevator) {
    }

    
}

// TODO: Add timer!