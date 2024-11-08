import express from 'express';
import fs from 'fs';
import { ReceivedDataType, StoredDataType } from './data/DataTypes';
import LinearRegression from './models/LinearRegression';

const RESULT_PATH = 'src/data/result.json';

const app = express();

const port = process.env.PORT ?? 3001;

app.use(express.json());

app.post('/api/predict', (req, res) => {
    // get data
    const data: ReceivedDataType = req.body;
    if (data.data === undefined || data.data.length === 0) {
        res.status(500).send('Error, wrong data format given!');
        return;
    }
    // prepare the data for model
    const y_values = data.data.map((item) => item.value);
    const x_values = [...Array(y_values.length).keys()];

    // model fitting and predicting
    const linReg = new LinearRegression();

    linReg.fit(x_values, y_values);

    const predictions = linReg.predict(10);

    const predictionsData: StoredDataType = {
        "result": {
            "timestamp": new Date().toISOString(),
            "parameters": linReg.getModelParameters(),
            "predictions": predictions
        }
    }

    // store the prediction data
    fs.writeFile(RESULT_PATH, JSON.stringify(predictionsData), (writeErr) => {
        if (writeErr) {
            return res.status(500).send('Error saving predictions');
        }
        return res.send("Prediction saved.");
    });
});

app.get('/api/prediction', (_, res) => {
    fs.readFile(RESULT_PATH, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading the file ${err.message}`);
            return;
        }

        const jdata: StoredDataType = JSON.parse(data);

        res.status(200).send(jdata);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
});
