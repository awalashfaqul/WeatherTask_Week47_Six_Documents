type Weather = {
    city: string;
    temperature: number;
    condition: string;
    code: number;
    icon: string;   
    windSpeed: number;      
    humidity: number;
    precipitation: number;
}

export type { Weather as default }