import express from 'express';
import fs from 'fs';
import { PostedDataType, StoredDataType } from './data/DataTypes';
import LinearRegression from './models/LinearRegression';

const RESULT_PATH = 'src/data/result.json';

const app = express();

const port = process.env.PORT ?? 3001;

// Adding the request body to request object
app.use(express.json());

app.post('/api/predict', (req, res) => {
    // get data
    const data: PostedDataType = req.body;

    // prepare the data for model
    const x_values = data.data.map((item) => item.value);
    const y_values = [...Array(10).keys()];

    // model fitting and predicting
    const linReg = new LinearRegression();

    linReg.fit(x_values, y_values);

    const predictions = linReg.predict(10);

    const predictionsData: StoredDataType = {
        "result": {
            "timestamp": Date.now().toString(),
            "parameters": linReg.getModelParameters(),
            "predictions": predictions
        }
    }

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
            res.status(500);
            return res.json(`Error reading the file ${err.message}`);
        }
        const jdata: StoredDataType = JSON.parse(data);

        res.status(200);
        return res.send(jdata);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
});
