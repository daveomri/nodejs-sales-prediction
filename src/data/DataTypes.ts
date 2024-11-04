export type ReceivedDataType = {
    "params": {
        "name": string;
        "value": string | number;
    }[],
    "data": {
        "timestamp": string;
        "value": number;
    }[]
};

export type StoredDataType = {
    "result": {
        "timestamp": string;
        "predictions": number[];
        "parameters": {
            "slope": number;
            "intercept": number;
        }
    }
};