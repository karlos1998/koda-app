import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFnRunnable } from "langchain/chains/openai_functions";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { format } from 'date-fns';
import * as dotenv from "dotenv";
import preFlightGuideData from "../pre-flight-guide/preFlightGuideData";

dotenv.config();

export class AIService {

    private readonly model: ChatOpenAI;
    private findCitiesRunnable;
    private findPreFlightInfoRunnable;
    private convertPreFlightInfoRagRunnable;

    private outputParser = new JsonOutputFunctionsParser();

    constructor() {
        this.model = new ChatOpenAI({
            model: "gpt-4-0613",
            temperature: 0,
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.findCitiesRunnable = createOpenAIFnRunnable({
            functions: [
                {
                    name: "find_arrival_city_and_departure_city",
                    description: "Check if the message requests flight details between two cities on a specific date",
                    parameters: {
                        type: "object",
                        properties: {
                            arrivalCity: { type: "string", description: "City indicating where the flight is arriving" },
                            arrivalCityCode: { type: "string", description: "Airport code for the arrival city" },
                            departureCity: { type: "string", description: "City indicating where the flight is departing from" },
                            departureCityCode: { type: "string", description: "Airport code for the departure city" },
                            date: { type: "string", description: "Departure date in Y-m-d format" }
                        },
                        required: ["arrivalCity", "departureCity", "date", "departureCityCode", "arrivalCityCode"]
                    }
                },
            ],
            llm: this.model,
            prompt: ChatPromptTemplate.fromMessages([
                ["system", "You are an assistant that helps users find flight information."],
                ["human", "{message}"]
            ]),
            enforceSingleFunctionUsage: true,
            outputParser: this.outputParser,
        });

        this.convertPreFlightInfoRagRunnable = createOpenAIFnRunnable({
            functions: [
                {
                    name: "find_pre_flight_info_rag",
                    description: "You will get json in which there is one key and one value which is a long description. Shorten it to a few sentences, it has to be in Polish and very legible, simple for the user. literally choose the most sensible 2-3 sentences from it.",
                    parameters: {
                        type: "object",
                        properties: {
                            key: { type: "string", description: "key which was in Polish. write it as legible"},
                            description: { type: "string", description: "The description that comes from the json value should be a shortened description of 2-3 sentences, very easy for the user to understand. Remember to remove spaces and other unnecessary things. Please shorten this description to a maximum of 50 words." },
                        },
                        required: ["key", "description"]
                    }
                },
            ],
            llm: this.model,
            prompt: ChatPromptTemplate.fromMessages([
                ["system", "You are an assistant that provides pre-flight information."],
                ["human", "{message}"]
            ]),
            enforceSingleFunctionUsage: true,
            outputParser: this.outputParser,
        });

        this.findPreFlightInfoRunnable = createOpenAIFnRunnable({
            functions: [
                {
                    name: "find_pre_flight_info",
                    description: "Based on the pre-departure details request, select the appropriate key from the list that matches the user's request. Here is the list: " + JSON.stringify(preFlightGuideData.getInstance().getDataKeys()),
                    parameters: {
                        type: "object",
                        properties: {
                            topic: { type: "string", description: "Key from list or 'unknown' if no key matches" },
                        },
                        required: ["topic"]
                    }
                },
            ],
            llm: this.model,
            prompt: ChatPromptTemplate.fromMessages([
                ["system", "You are a pre-flight information assistant. Select the appropriate conversation type from the list we will provide you with."],
                ["human", "{message}"]
            ]),
            enforceSingleFunctionUsage: true,
            outputParser: this.outputParser,
        });
    }

    public async findFlyDataInMessage(message: string) {
        return await this.findCitiesRunnable.invoke({ message }) as {
            arrivalCity: string,
            arrivalCityCode: string,
            departureCity: string,
            departureCityCode: string,
            date: string
        };
    }

    public async convertPreFlightInfo(message: string) {
        return await this.convertPreFlightInfoRagRunnable.invoke({ message }) as {
            key: string,
            description: string,
        };
    }

    public async findPreFlightInfoInMessage(message: string) {
        return await this.findPreFlightInfoRunnable.invoke({ message }) as { topic: string };
    }
}
