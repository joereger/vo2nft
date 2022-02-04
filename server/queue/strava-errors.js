

module.exports = class StravaThrottleError extends Error {
    constructor(message) {
        super(message);
        this.name = "StravaThrottleError";
    }
}

module.exports = class StravaAuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "StravaAuthError";
    }
}