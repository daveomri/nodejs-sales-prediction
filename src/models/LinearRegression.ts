
/**
 * Class is used for modeling and predicting future week sales.
 */
export default class LinearRegression {
    #slope!: number;
    #intercept!: number;
    #x_values!: number[];
    #y_values!: number[];
    #x_mean!: number;
    #y_mean!: number;

    /**
     * Method returns the model parameters.
     */
    getModelParameters(): {
        "slope": number;
        "intercept": number;
    } {
        return {
            "slope": this.#slope,
            "intercept": this.#intercept,
        };
    }

    /**
     * slope = (sum((x_i - X_avg) * (y_i - y_mean))) / (sum((x_i - X_avg)^2))
     */
    #countSlope(): number {
        let slopeNum = 0.0;
        let slopeDen = 0.0;

        for(let i = 0; i < this.#x_values.length; i++) {
            slopeNum += (this.#x_values[i] - this.#x_mean) * (this.#y_values[i] - this.#y_mean);
            slopeDen += Math.pow((this.#x_values[i] - this.#x_mean), 2);
        }

        return slopeNum / slopeDen;
    }

    /**
     * intercept = y_mean - slope * X_avg
     */
    #countIntercept(): number {
        return this.#y_mean - this.#x_mean * this.#slope;
    }

    /**
     * Method fits line into data.
     * 
     * @param x_val X axis data.
     * @param y_val Y axis data.
     */
    fit(x_vals: number[], y_vals: number[]) {
        this.#x_values = x_vals;
        this.#y_values = y_vals;
    
        this.#x_mean = this.#x_values.reduce((partialSum, a) => partialSum + a, 0) / this.#x_values.length;
        this.#y_mean = this.#y_values.reduce((partialSum, a) => partialSum + a, 0) / this.#y_values.length;

        this.#slope = this.#countSlope();

        this.#intercept = this.#countIntercept();
    }

    /**
     * Method performs prediction on trained line numSteps into the future.
     * @param numSteps Number of steps to predict.
     * @returns Method returns the array with predictions.
     */
    predict(numSteps: number): number[] {
        if (this.#slope === undefined || this.#x_values === undefined || this.#intercept === undefined) {
            return [];
        }
        return [...Array(numSteps).keys()].map((step) => 
            this.#slope * (this.#x_values.length + step) + this.#intercept);
    }
}