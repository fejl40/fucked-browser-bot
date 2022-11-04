import axios from "axios";

export interface ChuckNorrisJoke {
    categories: string[];
    created_at: string;
    icon_url: string;
    id: string;
    updated_at: string;
    url: string;
    value: string;
}

export class ChuckNorrisService {
    private static readonly categoriesEndpoint = "https://api.chucknorris.io/jokes/categories";
    private readonly categoryJokeEndpoint = "https://api.chucknorris.io/jokes/random?category=";
    private readonly randomJokeEndpoint = "https://api.chucknorris.io/jokes/random";

    public static async getCategories(): Promise<string[]> {
        const categoriesResponse = await axios.get<string[]>(this.categoriesEndpoint);
        if (categoriesResponse.status !== 200) return [];
        return categoriesResponse.data;
    }

    public async getCategoryJoke(category: string): Promise<ChuckNorrisJoke | null> {
        const jokeResponse = await axios.get<ChuckNorrisJoke>(`${this.categoryJokeEndpoint}${category}`);
        if (jokeResponse.status !== 200) return null;
        return jokeResponse.data;
    }

    public async getRandomJoke(): Promise<ChuckNorrisJoke | null> {
        const jokeResponse = await axios.get<ChuckNorrisJoke>(this.randomJokeEndpoint);
        if (jokeResponse.status !== 200) return null;
        return jokeResponse.data;
    }
}
