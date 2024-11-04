export type PostedDataType = {
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
    "results": {
        "timestamp": string;
        "prediction": number;
        "parameters": {
            "name": number
        }[]
    }
};