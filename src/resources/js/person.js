class Person {
    constructor(currentFloor, destinationFloor) {
        this.id = Math.random().toString(36).substr(2, 9);
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