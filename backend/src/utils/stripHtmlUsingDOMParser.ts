export function stripHtmlUsingRegex(htmlString: string): string {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}