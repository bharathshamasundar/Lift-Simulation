document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");


    if(startButton){
        startButton.addEventListener("click", startSimulation);
    }
    

    function startSimulation() {
        const numFloors = parseInt(document.getElementById("numFloors").value);
        const numLifts = parseInt(document.getElementById("numLifts").value);

        localStorage.setItem("numFloors", numFloors);
        localStorage.setItem("numLifts", numLifts);

        window.location.href = "simulation.html";
    }

    const numFloors = parseInt(localStorage.getItem("numFloors"));
    const numLifts = parseInt(localStorage.getItem("numLifts"));

    const floorContainer = document.getElementById("floorContainer");
    const liftContainer = document.getElementById("liftContainer");

    floorContainer.style.setProperty("--num-floors", numFloors);

    for (let floor = numFloors; floor >= 1; floor--) {
        const floorElement = createFloor(floor);
        floorContainer.appendChild(floorElement);
    }

    const lifts = [];

    for (let lift = 1; lift <= numLifts; lift++) {
        const liftElement = createLift(lift);
        liftContainer.appendChild(liftElement);
        lifts.push({ element: liftElement, currentFloor: 1 }); // Store lift element and current floor
    }

    function createFloor(floorNumber) {
        const floorElement = document.createElement("div");
        floorElement.className = "floor";
        floorElement.textContent = `Floor ${floorNumber}`;
        
        const upButton = document.createElement("button");
        upButton.textContent = "↑";
        upButton.className = "up-button";
        upButton.addEventListener("click", () => requestLift(floorNumber, "up"));
        
        
        const downButton = document.createElement("button");
        downButton.textContent = "↓";
        downButton.className = "down-button";
        downButton.addEventListener("click", () => requestLift(floorNumber, "down"));
        
        floorElement.appendChild(upButton);
        
        floorElement.appendChild(downButton);

        return floorElement;
    }

    function createLift(liftNumber) {
        const liftElement = document.createElement("div");
        liftElement.className = "lift";
        liftElement.textContent = `Lift ${liftNumber}`;
        const floorHeight = 80; // Adjust this based on your styling
        const translateY = (1 - 1) * floorHeight; // Start at the first floor
        liftElement.style.transform = `translateY(${translateY}px)`;
        return liftElement;
    }

    function requestLift(requestedFloor) {
        let closestLiftIndex = 0;
        let minDistance = Math.abs(requestedFloor - 1); // Initial distance to the first lift

        // Find the closest lift to the requested floor
        for (let i = 0; i < lifts.length; i++) {
            const liftDistance = Math.abs(requestedFloor - getLiftCurrentFloor(lifts[i]));
            if (liftDistance < minDistance) {
                minDistance = liftDistance;
                closestLiftIndex = i;
            }
        }

        moveLiftToFloor(lifts[closestLiftIndex], requestedFloor);
    }

    function getLiftCurrentFloor(liftElement) {
        console.log(liftElement)
        // Calculate the floor number based on the lift's position
        const liftPosition = parseInt(liftElement.element.outerHTML.style.transform.replace("translateY(", "").replace("px)", ""));
        const floorHeight = 80; // Adjust this based on your styling
        return Math.round(liftPosition / floorHeight) + 1;
    }

    function moveLiftToFloor(liftElement, floorNumber) {
        // Calculate the vertical translation based on the floor number
        const floorHeight = 80; // Adjust this based on your styling
        const translateY = (floorNumber - 1) * floorHeight;
        liftElement.style.transform = `translateY(${translateY}px)`;
    }
});
