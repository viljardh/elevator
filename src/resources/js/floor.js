class Floor {
    constructor(floorNumber) {
        this.floorNumber = floorNumber;
        this.waitingPeople = [];
        this.element = null;
    }

    addPerson(person) {
        this.waitingPeople.push(person);
    }

    removePerson(person) {
        const index = this.waitingPeople.findIndex(p => p.id === person.id);
        if (index !== -1) {
            this.waitingPeople.splice(index, 1);
            return true;
        }
        return false;
    }

    getPeopleWaiting() {
        return this.waitingPeople;
    }

    getFloorNumber() {
        return this.floorNumber;
    }

    clearAllPeople() {
        this.waitingPeople = [];
    }

    totalPeopleWaiting() {
        return this.waitingPeople.length
    }

    createElement() {
        const floorDiv = document.createElement('div');
        floorDiv.className = 'floor';
        floorDiv.dataset.floor = this.floorNumber;
        floorDiv.innerHTML = `
            <span class="floor-number">${this.floorNumber}</span>
            <div class="people-waiting" data-floor="${this.floorNumber}"></div>
        `;
        this.element = floorDiv;
        return floorDiv;
    }

    getPeople() {
        return [...this.waitingPeople];
    }



    transferPeopleToElevator(elevator, maxPeopleToBoard) {
       const peopleBoarded = [];
       let boardedCount = 0;
       
       // Filter people who can board (not already in elevator and elevator has capacity)
       this.waitingPeople = this.waitingPeople.filter(person => {
           if (!person.inElevator && boardedCount < maxPeopleToBoard) {
               console.log(`Person boarding from floor ${this.floorNumber}: going to floor ${person.destinationFloor}`);
               
               // Move person to elevator
               person.enterElevator();
               elevator.elevatorPeople.push(person);
               elevator.floorQueue.add(person.destinationFloor);
               
               peopleBoarded.push(person);
               boardedCount++;
               
               // Remove from this floor's waiting list
               return false;
           }
           return true;
       });
       
       console.log(`Floor ${this.floorNumber}: ${boardedCount} people boarded elevator`);
       return peopleBoarded;
    }
}