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

    enterElevator(elevator) {
        if (!checkIfFull(elevator)) {
            elevator.addPassenger(this)
        }
    }

    leaveElevator(elevator) {
        
    }

    
}

// TODO: Add timer!