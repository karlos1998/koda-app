import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFnRunnable } from "langchain/chains/openai_functions";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import * as dotenv from 'dotenv';
import { format } from 'date-fns';

dotenv.config();

const model = new ChatOpenAI({
    model: "gpt-4-0613",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

const outputParser = new JsonOutputFunctionsParser();


const findCities = createOpenAIFnRunnable({
    functions: [
        {
            name: "find_arrival_city_and_departure_city",
            description: "Check if the message requests flight details between two cities on a specific date",
            parameters: {
                type: "object",
                properties: {
                    arrivalCity: { type: "string", description: "find a city that indicates that there is a flight departure from it" },
                    arrivalCityCode: { type: "string", description: "find the city that indicates the flight is departing from, then return the airport code for that city" },
                    departureCity: { type: "string", description: "find the city that indicates that the flight is planned to it" },
                    departureCityCode: { type: "string", description: "find the city that indicates the flight is departing from and then display the airport code for that city" },
                    date: { type: "string", description: "Departure date. Get it from user input. Date must be in Y-m-d date format. Based on user input, period date in this format assuming today's date is: " + format(new Date, 'yyyy-MM-dd HH:mm:ss') }
                },
                required: ["arrivalCity", "departureCity", "date", "departureCityCode", "arrivalCityCode"]
            }
        },
    ],
    llm: model,
    prompt: ChatPromptTemplate.fromMessages([
        ["system", "You are an assistant that helps users find flight information."],
        ["human", "{message}"]
    ]),
    enforceSingleFunctionUsage: true,
    outputParser,
});

async function run() {
    // const userMessage = "Czy możesz podać najbliższe loty do Londynu z wylotem z Warszawy na 15 sierpnia?";
    // const userMessage = "Czy możesz podać najbliższe loty z Warszawy do Londynu na 15 sierpnia?";
    // const userMessage = "Czy możesz podać najbliższe loty na jutro? Miastem wylotu ma być Warszawa, a polecimy do Poznania";

    // const userMessage = "Czy możesz podać najbliższe loty na jutro? Miastem wylotu ma być Poznan, a polecimy do Warszawy";
    const userMessage = "dasz rade mi znalezc jakis lot z hiszpanii do polski na juz?";

    const response: any = await findCities.invoke({ message: userMessage, name: 'find_arrival_city_and_departure_city' });

    console.log("Initial Response:", response);

}

run();
