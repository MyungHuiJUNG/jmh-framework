export default class CounselFlowHubChannelError {

    constructor(channelType, error) {
        this.channelType = channelType;
        this.code = error.code;
        this.message = error.message;

        if (error.original !== undefined)
            this.original = error.original;
    }

    static make(content) {
        return Object.assign(content, {
            create: function(channelType) {
                if (channelType === undefined)
                    throw new Error("channelType is invalid.");

                return new CounselFlowHubChannelError(channelType, this);
            }
        });
    }

    static LOGIN_FAIL = CounselFlowHubChannelError.make({code: "1001", message: "login fail"});
    static LOGIN_ALREADY_LOGINED = CounselFlowHubChannelError.make({code: "1002", message: "already logined"});
    static LOGIN_ALREADY_INPROGRESS = CounselFlowHubChannelError.make({code: "1003", message: "already inprogress login"});
    static LOGIN_WRONG_ID = CounselFlowHubChannelError.make({code: "1004", message: "wrong id"});
    static LOGIN_WRONG_PASSWORD = CounselFlowHubChannelError.make({code: "1005", message: "wrong password"});
    static LOGIN_USING_EXTENSION = CounselFlowHubChannelError.make({code: "1006", message: "already using extension with another agent id"});
    static LOGIN_WRONG_TENANT = CounselFlowHubChannelError.make({code: "1004", message: "wrong tenant"});

    static CHANNEL_NOT_LOGINED = CounselFlowHubChannelError.make({code: "2001", message: "channel not logined"});
    static INVALID_CHANNEL_STATE = CounselFlowHubChannelError.make({code: "2002", message: "invalid channel state"});
    static INVALID_EXTENSION_NUMBER = CounselFlowHubChannelError.make({code: "2003", message: "invalid extension number"});
    static INVALID_DST_STATE = CounselFlowHubChannelError.make({code: "2004", message: "invalid destinated state"});
    static INVALID_DST_NUMBER = CounselFlowHubChannelError.make({code: "2005", message: "invalid destinated number"});
    static INVALID_AGENT_SERVICE = CounselFlowHubChannelError.make({code: "2006", message: "invalid agent service"});
    static INVALID_PARAMETER = CounselFlowHubChannelError.make({code: "2007", message: "invalid parameter"});

    static INVALID_CALL_STATE = CounselFlowHubChannelError.make({code: "3001", message: "invalid call state"});

    static CMD_ALREADY_PROCESSING = CounselFlowHubChannelError.make({code: "4001", message: "another command is processing"});

    static NO_RESOURCE_FOR_OPERATION = CounselFlowHubChannelError.make({code: "5001", message: "no resource for operation"});
    static NO_CALL_FOR_TRANSFER = CounselFlowHubChannelError.make({code: "5002", message: "no call for transfer"});

    static SERVER_CONNECT_ERROR = CounselFlowHubChannelError.make({code: "9997", message: "server connect error"});
    static TIMEOUT = CounselFlowHubChannelError.make({code: "9998", message: "operaton timeout"});
    static UNKNOWN_ERROR = CounselFlowHubChannelError.make({code: "9999", message: "unknown error"});
}
