class Person {
    constructor(currentFloor, destinationFloor) {
        this.id = Math.random().toString(36).substr(2, 9);
        console.log(this.id)
        this.currentFloor = currentFloor;
        this.destinationFloor = destinationFloor;
        this.direction = destinationFloor > currentFloor ? 'up' : 'down';
        this.inElevator = false;
    }
}