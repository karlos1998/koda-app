
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import {SearchResult} from "./flights/interfaces/SearchResult.interface";
import {FlyDataDTO} from "../AI/DTOs/FlyDataDTO";
export class SerpapiService {

    private client;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://serpapi.com/',
            params: {
                api_key: process.env.SERP_API_KEY,
            }
        })
    }
    private request<T>(
        engine: string,
        params: {[key: string]: any},
    ) {
        return this.client.get<T>('search', {
            params: {
                engine,
                ...params,
            }
        })
    }

    public async getFlights(flyData: FlyDataDTO) {
        return await this.request<SearchResult>('google_flights', {
            departure_id: flyData.departureCityCode,
            arrival_id: flyData.arrivalCityCode,
            outbound_date: flyData.date,
            // outbound_date: '2024-08-14',
            type: 2,
        }).then(({data}) => data)
    }
}