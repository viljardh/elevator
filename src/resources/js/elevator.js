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


    addPassenger(passenger) {
        if (!checkfIfFull()) {
            this.passengers.add(passenger)
        } 
    }


    notifyPassengers() {
        this.passengers.forEach( passenger => {
            if (passenger.destFloor() == this.currentFloor) {

            }
        })
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