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

    getId() {
        return this.id;
    }

    getDestinationFloor() {
        return this.destinationFloor;
    }

    enterElevator() {
        this.inElevator = true;
    }

    leaveElevator() {
        this.inElevator = false;
    }

    
}

// TODO: Add timer!