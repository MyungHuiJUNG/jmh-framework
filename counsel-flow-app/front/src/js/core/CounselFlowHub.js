export default class CounselFlowHub {

    constructor() {
        this.channels = new Map();
        this.eventCallbacks = [];
    }

    addChannel(channelType, channel) {
        this.channels.set(channelType, channel);

        channel.addEventCallback(function(event) {
            this.eventCallbacks.forEach(function (eventCallback) {
                eventCallback(event);
            });
        }.bind(this));
    }

    getChannel(channelType) {
        const channel = this.channels.get(channelType);
        if (channel === null || channel === undefined)
            throw new Error("[flow-hub] can't find channel : " + channelType);

        return channel;
    }

    addEventCallback(eventCallback) {
        if (eventCallback !== null && eventCallback !== undefined)
            this.eventCallbacks.unshift(eventCallback);
    }

    removeEventCallback(eventCallback) {
        if (eventCallback !== null && eventCallback !== undefined) {
            let removeIndex = this.eventCallbacks.indexOf(eventCallback);
            if (removeIndex >= 0)
                this.eventCallbacks.splice(removeIndex, 1);
        }
    }

    connect(channelTypes) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === true)
                    return;

                promises.push(channel.connect());
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === true)
                    return;

                promises.push(channel.connect());
            }.bind(this));
        }

        return Promise.all(promises);
    }

    disconnect(channelTypes) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.disconnect());
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.disconnect());
            }.bind(this));
        }

        return Promise.all(promises);
    }

    requestChannelState(channelTypes) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.requestChannelState());
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.requestChannelState());
            }.bind(this));
        }

        return Promise.all(promises);
    }

    login(channelTypes, channelInfo) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.login(channelInfo));
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.login(channelInfo));
            }.bind(this));
        }

        return Promise.all(promises);

    }

    logout(channelTypes, reasonCode) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.logout(reasonCode));
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.logout(reasonCode));
            }.bind(this));
        }

        return Promise.all(promises);
    }

    ready(channelTypes) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.ready());
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.ready());
            }.bind(this));
        }

        return Promise.all(promises);
    }

    absence(channelTypes, reasonCode) {
        const promises = [];
        if (channelTypes === undefined || channelTypes === null || channelTypes.length === 0) {
            this.channels.forEach(function(channel) {
                if (channel.connected === false)
                    return;

                promises.push(channel.absence(reasonCode));
            });
        }
        else {
            channelTypes.forEach(function(channelType) {
                const channel = this.getChannel(channelType);
                if (channel.connected === false)
                    return;

                promises.push(channel.absence(reasonCode));
            }.bind(this));
        }

        return Promise.all(promises);
    }

    process(channelTypes) {
    }
}
