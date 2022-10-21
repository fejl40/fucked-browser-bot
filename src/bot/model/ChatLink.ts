export interface ChatLink {
    full: string;
    body: string;
    uri: string;
    protocol: "https" | "http";
    index: number;
    fullMessage: string;
}
