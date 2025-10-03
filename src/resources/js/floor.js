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


}