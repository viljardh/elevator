class Building {
    constructor() {
        this.floors = [];
        this.elevator = null;
    }

    initializeBuilding() {
        const building = document.querySelector('.building');
        building.innerHTML = '';

        // Create floors (10 to 1 from top to bottom) using Floor class
        // better on divs to do reverse order
        for (let floorNum = 10; floorNum >= 1; floorNum--) {
            const floor = new Floor(floorNum);
            const floorDiv = floor.createElement();
            building.appendChild(floorDiv);
            this.floors.push(floor);
        }
        
        this.elevator = new Elevator();
    }

    // Down the line I want to give people agency
    // Right now controls is handled by building, 
    // but I want to have the elevator just being called
    // only knowing up an down 
    initializeControls() {
        const floorButtons = document.getElementById('floorButtons');
        const fromFloor = document.getElementById('fromFloor');
        const toFloor = document.getElementById('toFloor');

        // Create floor buttons
        for (let floor = 10; floor >= 1; floor--) {
            const button = document.createElement('button');
            button.className = 'floor-button';
            button.textContent = `Floor ${floor}`;
            button.onclick = () => this.elevator.callElevator(floor);
            if (floor === 1) button.classList.add('active');
            floorButtons.appendChild(button);
        }

        // Populate floor selectors
        for (let floor = 1; floor <= 10; floor++) {
            fromFloor.innerHTML += `<option value="${floor}">Floor ${floor}</option>`;
            toFloor.innerHTML += `<option value="${floor}">Floor ${floor}</option>`;
        }
        toFloor.selectedIndex = 1; // Default to floor 2
    }

    getElevator() {
        return this.elevator
    }

    getFloors() {
        return this.floors
    }

    findFloor(no) {
        for (const floor of this.floors) {
            console.log(no, floor.getFloorNumber);
            if (floor.getFloorNumber() == no) {
                return floor;
            }
        }
    }

    totalPeopleWaiting() {
        let totalPeople = 0
        this.floors.forEach( floor =>  {
            totalPeople += floor.totalPeopleWaiting()
        })
        return totalPeople
    }
      
}