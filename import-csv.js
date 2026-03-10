import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

if (!fs.existsSync(csvPath)) {
  console.log("❌ ERRO FATAL: O arquivo tasks.csv não foi encontrado na pasta!");
  process.exit(1);
}

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function runImport() {
    const linesParse = stream.pipe(csvParse);

    for await (const line of linesParse){
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
    }
   


}

runImport()



