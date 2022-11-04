import linkRegex from "../link";
import { ChatLink } from "../model/ChatLink";

export class FilterService {
    public linkFromString(str: string, regexFiler = linkRegex): ChatLink | null {
        const link = regexFiler.exec(str);
        if (!link) return null;
        const protocol: "https" | "http" = link[1] === "https" ? "https" : "http";
        const obj: ChatLink = {
            full: link[0],
            protocol,
            body: link[2],
            uri: link[3],
            index: link.index,
            fullMessage: link.input,
        };
        const lastPartOfUri = obj.uri.substring(obj.uri.lastIndexOf("/")).toLowerCase();
        if (lastPartOfUri.includes(".jpeg")) return null;
        if (lastPartOfUri.includes(".png")) return null;
        if (lastPartOfUri.includes(".svg")) return null;
        if (lastPartOfUri.includes(".webp")) return null;
        return obj;
    }
}
