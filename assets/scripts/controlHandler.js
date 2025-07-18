// assets/scripts/controlHandler.js
export class ControlHandler {
    constructor(airplane) {
        this.airplane = airplane;
        this.keys = {};

        this.currentThrottle = 0.0;
        if (this.airplane && this.airplane.flightPhysics) {
            this.currentThrottle = this.airplane.flightPhysics.throttle;
        }
        this.throttleStep = 0.01;

        this.bindEvents();
        this.updateAirplane();
    }

    bindEvents() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        this.keys[event.key] = true;
        this.updateAirplane();
    }

    handleKeyUp(event) {
        this.keys[event.key] = false;
        this.updateAirplane();
    }

    updateAirplane() {
        if (!this.airplane || !this.airplane.flightPhysics) return;

        let newThrottle = this.currentThrottle;
        let elevatorInput = 0;
        let yawInput = 0;
        let aileronInput = 0;

        // Update throttle
        if (this.keys['ArrowUp']) {
            newThrottle = Math.min(1, this.currentThrottle + this.throttleStep);
        } else if (this.keys['ArrowDown']) {
            newThrottle = Math.max(0, this.currentThrottle - this.throttleStep);
        }
        this.currentThrottle = newThrottle;
        this.airplane.applyControl('throttle', this.currentThrottle);

        // Update elevator
        if (this.keys['w']) {
            elevatorInput = 0.1; // Pitch up
        } else if (this.keys['s']) {
            elevatorInput = -0.1; // Pitch down
        }
        this.airplane.applyControl('elevator', elevatorInput);


        // Update yaw
        if (this.keys['a']) {
            yawInput = 0.05; // Yaw left
        } else if (this.keys['d']) {
            yawInput = -0.05; // Yaw right
        }
        this.airplane.applyControl('yaw', yawInput);

        // Update roll 
        if (this.keys['q']) {
            aileronInput = 1; // Roll left
        } else if (this.keys['e']) {
            aileronInput = -1; // Roll right
        }
        this.airplane.applyControl('ailerons', aileronInput);
    }

    dispose() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}