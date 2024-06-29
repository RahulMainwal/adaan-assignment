class ApiResponse {
    constructor(statusCode, data={}, message, success) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success || false;
    }
}

module.exports = ApiResponse;