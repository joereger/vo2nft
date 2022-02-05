

module.exports = class StravaAuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "StravaAuthError";
    }
}


