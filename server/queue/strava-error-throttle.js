

module.exports = class StravaThrottleError extends Error {
    constructor(message) {
        super(message);
        this.name = "StravaThrottleError";
    }
}

