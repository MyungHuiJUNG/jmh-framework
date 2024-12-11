export default class CounselFlowHubConsole {
    static isPrintLog = true;
    static isPrintInfo = true;
    static isPrintDebug = false;
    static isPrintTrace = false;
    static isPrintWarn = true;
    static isPrintError = true;

    static _isPrintLog() {
        if (this.isPrintLog !== undefined)
            return this.isPrintLog;

        return super.isPrintLog;
    }

    static _isPrintInfo() {
        if (this.isPrintInfo !== undefined)
            return this.isPrintInfo;

        return super.isPrintLog;
    }

    static _isPrintDebug() {
        if (this.isPrintDebug !== undefined)
            return this.isPrintDebug;

        return super.isPrintDebug;
    }

    static _isPrintTrace() {
        if (this.isPrintTrace !== undefined)
            return this.isPrintTrace;

        return super.isPrintTrace;
    }

    static _isPrintWarn() {
        if (this.isPrintWarn !== undefined)
            return this.isPrintWarn;

        return super.isPrintWarn;
    }

    static _isPrintError() {
        if (this.isPrintError !== undefined)
            return this.isPrintError;

        return super.isPrintError;
    }

    static log() {
        if (this._isPrintLog() === true)
            console.log.apply(console, arguments);
    }

    static info() {
        if (this._isPrintInfo() === true)
            console.info.apply(console, arguments);
    }

    static debug() {
        if (this._isPrintDebug() === true)
            console.debug.apply(console, arguments);
    }

    static trace() {
        if (this._isPrintTrace() === true)
            console.trace.apply(console, arguments);
    }

    static warn() {
        if (this._isPrintWarn() === true)
            console.warn.apply(console, arguments);
    }

    static error() {
        if (this._isPrintError() === true)
            console.error.apply(console, arguments);
    }
}
