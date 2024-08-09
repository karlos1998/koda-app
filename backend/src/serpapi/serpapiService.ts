
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
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
    private request(
        engine: string,
        params: {[key: string]: any},
    ) {
        return this.client.get('search', {
            params: {
                engine,
                ...params,
            }
        })
    }

    public async getFlights() {
        return await this.request('google_flights', {
            departure_id: 'WAW',
            arrival_id: 'KRK',
            outbound_date: '2024-08-10',
            type: 2,
        }).then(({data}) => data)
    }
}