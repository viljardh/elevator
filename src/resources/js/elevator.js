class Elevator {
    constructor() {
        this.passengers = [];
        this.destination = [];
        this.capacity = 4;
        this.currentFloor = 1;
        this.moving = false;
        this.direction = null;
        this.className = 'elevator';
        this.id = 'elevator';
        this.innerHTML = `
            <div style="font-size: 10px;">🚪</div>
            <div class="elevator-people" id="elevatorPeople"></div>
        `;

    }

    call(floor, direction) {
        const passDesto = new passengerDesto(floor, direction)
        this.destination.add(passDesto)
    }

    checkIfFull() {
        let c = 0;
        for (let i = 0; i < this.passengers.length(); i++) {
        }
    }
    addPassenger(passenger) {
        this.passengers.add(passenger)
    }
    
};

const direction = Object.freeze({
    UP: Symbol("up"),
    DOWN: Symbol("down")
});

class passengerDesto {
    constructor(floor, direction) {
        this.floor = floor;
        this.direction = direction
    }
}