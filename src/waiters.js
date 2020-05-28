const { spawn } = require('child_process');

const waiter = (code, solve_on, error_on) => {

    return new Promise(function (resolve, reject) {
        shiny_proc = spawn('Rscript', ['-e', code]);

        shiny_proc.stderr.on('data', (data) => {
            if (data.includes(error_on)) {
                reject(data.toString())
            }
            if (data.includes(solve_on)) {
                resolve({ 
                    shiny_proc, 
                    rawoutput: data, 
                    url: data.toString().split(" ")[2]
                })
            }
        });

        shiny_proc.stdout.on('data', (data) => {
            if (data.includes(error_on)) {
                reject(data.toString())
            }
            if (data.includes(solve_on)) {
                resolve({ 
                    shiny_proc, 
                    rawoutput: data, 
                    url: data.toString().split(" ")[2]
                })
            }
        });
    })
}

const shiny_waiter = (code) => {
    return waiter(code, solve_on = "Listening on", error_on = "Error")
}

const markdown_waiter = (code) => {
    return waiter(code, solve_on = "Output created:", error_on = "Error")
}

module.exports = {
    shiny_waiter: shiny_waiter, 
    markdown_waiter: markdown_waiter
};