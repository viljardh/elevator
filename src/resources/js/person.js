class Person {
    constructor(id, currentFloor, destinationFloor) {
        this.id =id;
        console.log(this.id)
        this.currentFloor = currentFloor;
        this.destinationFloor = destinationFloor;
        this.direction = destinationFloor > currentFloor ? 'up' : 'down';
        this.inElevator = false;
    }

    destFloor() {
        return this.destinationFloor
    }
}